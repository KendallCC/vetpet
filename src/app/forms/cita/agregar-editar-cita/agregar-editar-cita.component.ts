import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CitasService } from '../../../share/services/citas.service';
import { UsuarioService } from '../../../share/services/usuario.service';
import { SucursalService } from '../../../share/services/sucursal.service';
import { ServicesService } from '../../../share/services/services.service';
import { listaClientes } from '../../../share/interfaces/cliente';
import { ListaSucursales, Sucursal } from '../../../share/interfaces/sucursal';
import { listaServicios } from '../../../share/interfaces/servicio';
import { FormvalidationsService } from '../../../share/formvalidations.service';
import { MascotaService } from '../../../share/services/mascota.service';
import { ListaMascota } from '../../../share/interfaces/mascota';
import { EstadoCita } from '../../../share/interfaces/cita';
import { FacturaService } from '../../../share/services/factura.service';

@Component({
  selector: 'app-agregar-editar-cita',
  templateUrl: './agregar-editar-cita.component.html',
  styleUrls: ['./agregar-editar-cita.component.css'],
})
export class AgregarEditarCitaComponent implements OnInit {
  listaClientes: listaClientes = [];
  sucursal: Sucursal;
  listaServicios: listaServicios = [];
  selectedServicios: any[] = [];
  selectedSucursal: any;
  ListaMascotas: ListaMascota = [];
  citaForm: FormGroup;
  idGerente: number;

  constructor(
    public dialogRef: MatDialogRef<AgregarEditarCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private citaService: CitasService,
    private clienteService: UsuarioService,
    private facturaservice: FacturaService,
    private sucursalService: SucursalService,
    private servicioService: ServicesService,
    private mascotaService: MascotaService,
    public formValidation: FormvalidationsService
  ) {
    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      id_Cliente: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      sucursal: [{ value: '', disabled: true }, Validators.required],
      id_sucursal: [''],
      id_Servicio: [[], Validators.required],
      id_mascota: ['', Validators.required],
      duracion: [{ value: '', disabled: true }],
      hora_inicio: ['', Validators.required],
      hora_fin: [{ value: '', disabled: true }],
      observaciones: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      motivo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      condicion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      vacunas: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      estado: [{ value: EstadoCita[0], disabled: true }], // Nuevo campo estado
      precio: [{ value: '', disabled: true }] // Nuevo campo precio
    }, { validators: this.timeRangeValidator });

    this.idGerente = data.id;
  }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerServicios();

    this.citaForm.get('id_Cliente').valueChanges.subscribe(clienteId => {
      if (clienteId) {
        const cliente = this.listaClientes.find(c => c.id === clienteId);
        if (cliente) {
          this.citaForm.patchValue({
            email: cliente.correo_electronico
          });
          this.obtenerSucursal(cliente.id_sucursal);
          this.obtenerMascotasCliente(cliente.id);
        }
      }
    });

    this.citaForm.get('id_Servicio').valueChanges.subscribe(servicioIds => {
      this.selectedServicios = servicioIds.map(id => this.listaServicios.find(s => s.id === id));
      if (this.selectedServicios.length) {
        const totalDuration = this.selectedServicios.reduce((total, servicio) => {
          const duration = new Date(servicio.tiempo_servicio);
          return total + duration.getUTCHours() * 60 + duration.getUTCMinutes();
        }, 0);
        const totalPrice = this.selectedServicios.reduce((total, servicio) => total + servicio.tarifa, 0);

        const hours = Math.floor(totalDuration / 60);
        const minutes = totalDuration % 60;
        this.citaForm.patchValue({
          duracion: `${hours}h ${minutes}m`,
          precio: totalPrice
        });
        this.updateHoraFin();
      } else {
        this.citaForm.patchValue({
          duracion: '',
          precio: ''
        });
      }
    });

    this.citaForm.get('hora_inicio').valueChanges.subscribe(() => {
      this.updateHoraFin();
    });
  }

  obtenerClientes() {
    this.clienteService.getClientes().subscribe((listaClientes) => {
      this.clienteService.getCliente(this.idGerente).subscribe((gerente => {
        this.idGerente = gerente.id_sucursal;
        this.listaClientes = listaClientes.filter(e => e.id_sucursal == this.idGerente);
      }));
    });
  }

  obtenerSucursal(id: number) {
    this.sucursalService.getSucursal(id).subscribe((sucursal) => {
      this.sucursal = sucursal;
      this.citaForm.patchValue({
        sucursal: sucursal.nombre,
        id_sucursal: sucursal.id
      });
      this.selectedSucursal = sucursal.id;
    });
  }

  obtenerServicios() {
    this.servicioService.getServices().subscribe((listaServicios) => {
      this.listaServicios = listaServicios;
    });
  }

  obtenerMascotasCliente(id: number) {
    this.mascotaService.getMascotasClientes(id).subscribe((ListaMascotas) => {
      this.ListaMascotas = ListaMascotas;
    });
  }

  updateHoraFin(): void {
    const horaInicio = this.citaForm.get('hora_inicio').value;
    if (horaInicio && this.selectedServicios.length) {
      const [hours, minutes] = horaInicio.split(':').map(Number);
      const totalDuration = this.selectedServicios.reduce((total, servicio) => {
        const duration = new Date(servicio.tiempo_servicio);
        return total + duration.getUTCHours() * 60 + duration.getUTCMinutes();
      }, 0);

      const endTime = new Date();
      endTime.setHours(hours, minutes + totalDuration);

      const formattedEndTime = endTime.toTimeString().slice(0, 5);
      this.citaForm.patchValue({
        hora_fin: formattedEndTime
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.citaForm.valid) {
      const reserva = this.citaForm.value;
      reserva.id_Servicio = this.selectedServicios.map(s => s.id);
  
      this.citaService.postCita(reserva).subscribe((response) => {
        this.dialogRef.close(true);
        this.formValidation.mensajeExito("Cita agregada con éxito", 'Agregar');
      },
        error => {
          this.formValidation.mensajeError(error.error, 'Agregar');
        });
    }
  }

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar la hora y comparar solo la fecha
    if (d) {
      d.setHours(0, 0, 0, 0); // Ignorar la hora y comparar solo la fecha
      return d >= today;
    }
    return false;
  }

  isFieldInvalid(field: string): boolean {
    return this.formValidation.isFieldInvalid(this.citaForm, field);
  }

  getErrorMessage(field: string): string {
    return this.formValidation.getErrorMessage(this.citaForm, field);
  }

  timeRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const hora_inicio = group.get('hora_inicio').value;
    const hora_fin = group.get('hora_fin').value;

    if (hora_inicio && hora_fin) {
      const [horaInicioHours, horaInicioMinutes] = hora_inicio.split(':').map(Number);
      const [horaFinHours, horaFinMinutes] = hora_fin.split(':').map(Number);

      if (horaInicioHours > horaFinHours || (horaInicioHours === horaFinHours && horaInicioMinutes >= horaFinMinutes)) {
        return { timeRangeInvalid: true };
      }
    }
    return null;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'Pendiente';
      case 'Confirmada':
        return 'Confirmada';
      case 'Reprogramada':
        return 'Reprogramada';
      case 'Completada':
        return 'Completada';
      case 'Cancelada':
        return 'Cancelada';
      case 'No_asistio':
        return 'No_asistio';
      default:
        return '';
    }
  }
}
