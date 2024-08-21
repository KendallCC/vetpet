import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CitasService } from '../../../share/services/citas.service';
import { MascotaService } from '../../../share/services/mascota.service';
import { ServicesService } from '../../../share/services/services.service'; // Importar el servicio para obtener los servicios
import { FormvalidationsService } from '../../../share/formvalidations.service';
import { CarritoService } from '../../../share/services/carrito.service'; // Importar el servicio de carrito
import { ListaMascota } from '../../../share/interfaces/mascota';
import { listaServicios } from '../../../share/interfaces/servicio'; // Importar la interfaz para servicios

@Component({
  selector: 'app-agregar-cita-modal',
  templateUrl: './agregar-cita-modal.component.html',
  styleUrls: ['./agregar-cita-modal.component.css'],
})
export class AgregarCitaModalComponent implements OnInit {
  citaForm: FormGroup;
  ListaMascotas: ListaMascota = [];
  listaServicios: listaServicios = []; // Lista de servicios
  idSucursal: number;
  selectedServicios: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AgregarCitaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private citaService: CitasService,
    private mascotaService: MascotaService,
    private servicioService: ServicesService,
    private carritoService: CarritoService, // Inyectar CarritoService
    public formValidation: FormvalidationsService
  ) {
    const horaFormateada = this.formatearHora(data.hora); // Formatear la hora

    this.citaForm = this.fb.group({
      fecha: [{ value: data.fecha, disabled: true }, Validators.required],
      hora_inicio: [{ value: horaFormateada, disabled: false }, Validators.required],
      id_Cliente: [{ value: data.idCliente, disabled: false }, Validators.required],
      nombre_cliente: [{ value: data.nombreCliente, disabled: true }],
      correo_electronico: [{ value: data.correoCliente, disabled: true }],
      id_mascota: ['', Validators.required],
      id_servicio: [[], Validators.required],
      duracion: [{ value: '', disabled: true }],
      hora_fin: [{ value: '', disabled: true }],
      precio: [{ value: '', disabled: true }],
      observaciones: ['', [Validators.required, Validators.minLength(5)]],
      motivo: ['', [Validators.required, Validators.minLength(5)]],
      condicion: ['', [Validators.required, Validators.minLength(5)]],
      vacunas: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.idSucursal = data.idSucursal;
  }

  ngOnInit(): void {
    this.obtenerMascotasCliente(this.data.idCliente);
    this.obtenerServicios().then(() => {
      if (this.data.servicioId) {
        const servicio=parseInt(this.data.servicioId)
        this.citaForm.patchValue({
          id_servicio: [servicio] // Preseleccionar el servicio
        });
        
        this.selectedServicios = [this.listaServicios.find((s) => s.id === servicio)];
        this.recalcularDuracionYPrecio();
      }
    });

    this.citaForm.get('id_servicio').valueChanges.subscribe((servicioIds) => {
      this.selectedServicios = servicioIds.map((id) =>
        this.listaServicios.find((s) => s.id === id)
      );
      this.recalcularDuracionYPrecio();
    });

    this.citaForm.get('hora_inicio').valueChanges.subscribe(() => {
      this.updateHoraFin();
    });
  }

  formatearHora(hora: string): string {
    const [hours, minutes] = hora.split(':');
    return `${hours}:${minutes}`; // Devuelve la hora en formato HH:MM
  }

  obtenerMascotasCliente(idCliente: number): void {
    this.mascotaService.getMascotasClientes(idCliente).subscribe((mascotas) => {
      this.ListaMascotas = mascotas;
    });
  }

  async obtenerServicios(): Promise<void> {
    this.listaServicios = await this.servicioService.getServices().toPromise();
  }

  recalcularDuracionYPrecio(): void {
    if (this.selectedServicios.length) {
      const totalDuration = this.selectedServicios.reduce((total, servicio) => {
        const duration = this.convertirTiempoServicioADuracion(servicio.tiempo_servicio);
        return total + duration;
      }, 0);
      const totalPrice = this.selectedServicios.reduce(
        (total, servicio) => total + servicio.tarifa,
        0
      );

      const hours = Math.floor(totalDuration / 60);
      const minutes = totalDuration % 60;
      this.citaForm.patchValue({
        duracion: `${hours}h ${minutes}m`,
        precio: totalPrice,
      });

      this.updateHoraFin();
    } else {
      this.citaForm.patchValue({
        duracion: '',
        precio: '',
      });
    }
  }

  convertirTiempoServicioADuracion(tiempoServicio: string): number {
    const durationDate = new Date(tiempoServicio);
    const hours = durationDate.getUTCHours();
    const minutes = durationDate.getUTCMinutes();
    return hours * 60 + minutes;
  }

  updateHoraFin(): void {
    const horaInicio = this.citaForm.get('hora_inicio').value;
    if (horaInicio && this.selectedServicios.length) {
      const [hours, minutes] = horaInicio.split(':').map(Number);
      const totalDuration = this.selectedServicios.reduce((total, servicio) => {
        const duration = this.convertirTiempoServicioADuracion(servicio.tiempo_servicio);
        return total + duration;
      }, 0);

      const endTime = new Date();
      endTime.setHours(hours, minutes + totalDuration);

      const formattedEndTime = endTime.toTimeString().slice(0, 5);
      this.citaForm.patchValue({
        hora_fin: formattedEndTime,
      });
    }
  }

  onSubmit(): void {
    if (this.citaForm.valid) {
      // Combina la fecha y la hora para crear una fecha completa
      const fecha = new Date(this.data.fecha); // La fecha proporcionada en los datos del modal
      const hora = this.citaForm.get('hora_inicio')?.value.split(':'); // Obtener la hora del formulario
      fecha.setHours(parseInt(hora[0], 10), parseInt(hora[1], 10)); // Establece la hora en la fecha

      // Ajustar la fecha a la zona horaria de Costa Rica (UTC-6)
      const offsetMs = fecha.getTimezoneOffset() * 60000; // Desajuste en milisegundos
      const fechaCostaRica = new Date(fecha.getTime() - offsetMs + (6 * 60 * 60000)); // Ajuste a UTC-6

      // Convierte la fecha completa a formato ISO
      const fechaISO = fechaCostaRica.toISOString();

      const nuevaCita = {
        ...this.citaForm.value,
        id_sucursal: this.idSucursal,
        id_Servicio: this.citaForm.get('id_servicio')?.value, // Usa el nombre correcto `id_Servicio`
        estado: 'Pendiente', // Establecer el estado predeterminado
        fecha: fechaISO, // Fecha completa en formato ISO ajustada a UTC-6
      };

      console.log('Esta es la nueva cita ', nuevaCita);

      // Guardar los servicios seleccionados en el carrito usando el CarritoService
      this.selectedServicios.forEach(servicio => {
        this.carritoService.agregarServicio(servicio);
      });

      this.citaService.postCita(nuevaCita).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.setItem('currentInvoiceId', response.nuevaFactura.id.toString());
          this.dialogRef.close(true);
          this.formValidation.mensajeExito('Cita agregada con éxito', 'Agregar');
        },
        (error) => {
          this.formValidation.mensajeError(error.error, 'Agregar');
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isFieldInvalid(field: string): boolean {
    return this.formValidation.isFieldInvalid(this.citaForm, field);
  }

  getErrorMessage(field: string): string {
    return this.formValidation.getErrorMessage(this.citaForm, field);
  }
}
