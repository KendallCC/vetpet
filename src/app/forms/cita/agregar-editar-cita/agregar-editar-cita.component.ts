import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CitasService } from '../../../share/services/citas.service';
import { UsuarioService } from '../../../share/services/usuario.service';
import { SucursalService } from '../../../share/services/sucursal.service';
import { ServicesService } from '../../../share/services/services.service';
import { listaClientes } from '../../../share/interfaces/cliente';
import { Sucursal } from '../../../share/interfaces/sucursal';
import { listaServicios } from '../../../share/interfaces/servicio';
import { FormvalidationsService } from '../../../share/formvalidations.service';
import { MascotaService } from '../../../share/services/mascota.service';
import { ListaMascota } from '../../../share/interfaces/mascota';

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
  operacion: string;
  estadosCita: string[] = [
    'Pendiente',
    'Confirmada',
    'Reprogramada',
    'Completada',
    'Cancelada',
    'No_asistio',
  ];

  constructor(
    public dialogRef: MatDialogRef<AgregarEditarCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private citaService: CitasService,
    private clienteService: UsuarioService,
    private sucursalService: SucursalService,
    private servicioService: ServicesService,
    private mascotaService: MascotaService,
    public formValidation: FormvalidationsService
  ) {
    this.citaForm = this.fb.group(
      {
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
        observaciones: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(100),
          ],
        ],
        motivo: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        condicion: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        vacunas: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        ],
        estado: [{ value: 'Pendiente', disabled: true }, Validators.required],
        precio: [{ value: '', disabled: true }],
      },
      { validators: this.timeRangeValidator }
    );
    this.operacion = 'Crear';
    this.idGerente = data.id;
  }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerServicios();

    if (this.data && this.data.idCita) {
      this.operacion = 'Editar';
      this.loadCita(this.data.idCita);
    }

    this.citaForm.get('id_Cliente').valueChanges.subscribe((clienteId) => {
      if (clienteId) {
        const cliente = this.listaClientes.find((c) => c.id === clienteId);
        if (cliente) {
          this.citaForm.patchValue({
            email: cliente.correo_electronico,
          });
          this.obtenerSucursal(cliente.id_sucursal);
          this.obtenerMascotasCliente(cliente.id);
        }
      }
    });

    this.citaForm.get('id_Servicio').valueChanges.subscribe((servicioIds) => {
      this.selectedServicios = servicioIds.map((id) =>
        this.listaServicios.find((s) => s.id === id)
      );
      this.recalcularDuracionYPrecio();
    });

    this.citaForm.get('hora_inicio').valueChanges.subscribe(() => {
      this.updateHoraFin();
    });
  }

  loadCita(idCita: number): void {
    this.citaService.getCita(idCita).subscribe((cita) => {
      const fechaCita = new Date(cita.hora_cita);
      const horaInicio = fechaCita.toTimeString().slice(0, 5);

      const totalDuration = cita.facturas[0].detalle_factura.reduce(
        (total, detalle) => {
          const duration = this.convertirTiempoServicioADuracion(
            detalle.servicio.tiempo_servicio
          );
          return total + duration;
        },
        0
      );

      const [hours, minutes] = horaInicio.split(':').map(Number);
      const horaFin = new Date(fechaCita);
      horaFin.setHours(hours, minutes + totalDuration);
      const formattedHoraFin = horaFin.toTimeString().slice(0, 5);

      const duracionHoras = Math.floor(totalDuration / 60);
      const duracionMinutos = totalDuration % 60;
      const duracion = `${duracionHoras}h ${duracionMinutos}m`;

      this.citaForm.patchValue({
        fecha: new Date(cita.fecha_cita),
        id_Cliente: cita.id_cliente,
        email: cita.cliente.correo_electronico,
        sucursal: cita.sucursal.nombre,
        id_sucursal: cita.sucursal.id,
        id_Servicio: cita.facturas[0].detalle_factura.map(
          (df) => df.id_servicio
        ),
        id_mascota: cita.id_mascota,
        observaciones: cita.observaciones,
        motivo: cita.motivo,
        condicion: cita.condicion,
        vacunas: cita.vacunas,
        estado: cita.estado,
        precio: cita.facturas[0].total,
        hora_inicio: horaInicio,
        duracion: duracion,
        hora_fin: formattedHoraFin,
      });

      this.selectedServicios = this.listaServicios.filter((s) =>
        cita.facturas[0].detalle_factura.some((df) => df.id_servicio === s.id)
      );
      this.recalcularDuracionYPrecio();
      this.updateHoraFin();
      this.obtenerMascotasCliente(cita.id_cliente);
    });
  }

  obtenerClientes() {
    this.clienteService.getClientes().subscribe((listaClientes) => {
      this.clienteService.getCliente(this.idGerente).subscribe((gerente) => {
        this.idGerente = gerente.id_sucursal;
        this.listaClientes = listaClientes.filter(
          (e) => e.id_sucursal == this.idGerente
        );
      });
    });
  }

  obtenerSucursal(id: number) {
    this.sucursalService.getSucursal(id).subscribe((sucursal) => {
      this.sucursal = sucursal;
      this.citaForm.patchValue({
        sucursal: sucursal.nombre,
        id_sucursal: sucursal.id,
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

  convertirTiempoServicioADuracion(tiempoServicio: string): number {
    const durationDate = new Date(tiempoServicio);
    const hours = durationDate.getUTCHours();
    const minutes = durationDate.getUTCMinutes();
    return hours * 60 + minutes;
  }

  recalcularDuracionYPrecio(): void {
    if (this.selectedServicios.length) {
      const totalDuration = this.selectedServicios.reduce((total, servicio) => {
        const duration = this.convertirTiempoServicioADuracion(
          servicio.tiempo_servicio
        );
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

  updateHoraFin(): void {
    const horaInicio = this.citaForm.get('hora_inicio').value;
    if (horaInicio && this.selectedServicios.length) {
      const [hours, minutes] = horaInicio.split(':').map(Number);
      const totalDuration = this.selectedServicios.reduce((total, servicio) => {
        const duration = this.convertirTiempoServicioADuracion(
          servicio.tiempo_servicio
        );
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.citaForm.valid) {
      const reserva = this.citaForm.value;

      // Si es una nueva cita, asegurarse de que el estado sea "Pendiente"
      if (!this.data.idCita) {
        reserva.estado = 'Pendiente';
      } else {
        // Si es una cita existente, no modificar el estado
        reserva.estado = this.citaForm.get('estado').value;
      }

      if (!reserva.id_Servicio.length) {
        reserva.id_Servicio = this.selectedServicios.map((s) => s.id);
      }
      console.log(reserva);
      
      if (this.data.idCita) {
        this.citaService.updateCita(this.data.idCita, reserva).subscribe(
          (response) => {
            this.dialogRef.close(true);
            this.formValidation.mensajeExito(
              'Cita Actualizada con éxito',
              'Actualizar'
            );
          },
          (error) => {
            this.formValidation.mensajeError(error.error, 'Editar');
          }
        );
      } else {
        this.citaService.postCita(reserva).subscribe(
          (response) => {
            this.dialogRef.close(true);
            this.formValidation.mensajeExito(
              'Cita agregada con éxito',
              'Agregar'
            );
          },
          (error) => {
            this.formValidation.mensajeError(error.error, 'Agregar');
          }
        );
      }
    }
  }

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d) {
      d.setHours(0, 0, 0, 0);
      return d >= today;
    }
    return false;
  };

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
      const [horaInicioHours, horaInicioMinutes] = hora_inicio
        .split(':')
        .map(Number);
      const [horaFinHours, horaFinMinutes] = hora_fin.split(':').map(Number);

      if (
        horaInicioHours > horaFinHours ||
        (horaInicioHours === horaFinHours &&
          horaInicioMinutes >= horaFinMinutes)
      ) {
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
