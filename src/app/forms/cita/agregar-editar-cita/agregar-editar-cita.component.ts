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

@Component({
  selector: 'app-agregar-editar-cita',
  templateUrl: './agregar-editar-cita.component.html',
  styleUrl: './agregar-editar-cita.component.css',
})
export class AgregarEditarCitaComponent implements OnInit {

  listaClientes: listaClientes = [];
  sucursal: Sucursal;
  listaServicios: listaServicios = [];
  selectedServicio: any;
  SelectedSucursal: any;
  ListaMascotas:ListaMascota=[];
  citaForm: FormGroup;

  idGerente:number;


  constructor(
    public dialogRef: MatDialogRef<AgregarEditarCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private citaService: CitasService,
    private clienteService: UsuarioService,
    private sucursalService: SucursalService,
    private servicioService: ServicesService,
    private mascotaService:MascotaService,
    public formValidation: FormvalidationsService
  ) {
    this.citaForm = this.fb.group({
      fecha: ['', Validators.required],
      id_Cliente: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      sucursal: [{ value: '', disabled: true }, Validators.required],
      id_sucursal:[''],
      id_Servicio: ['', Validators.required],
      id_mascota: ['', Validators.required],
      duracion: [{ value: '', disabled: true }],
      hora_inicio: ['', Validators.required],
      hora_fin: [{ value: '', disabled: true }],
      observaciones: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      motivo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      condicion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      vacunas: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    }, { validators: this.timeRangeValidator });

    this.idGerente=data.id
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
          this.obtenerMascotasCliente(cliente.id)
        }
      }
    });

    this.citaForm.get('id_Servicio').valueChanges.subscribe(servicioId => {
      const servicio = this.listaServicios.find(s => s.id === servicioId);
      if (servicio) {
        this.selectedServicio = servicio;
        this.citaForm.patchValue({
          duracion: this.formatDuration(servicio.tiempo_servicio)
        });
        this.updateHoraFin();
      }
    });

    this.citaForm.get('hora_inicio').valueChanges.subscribe(() => {
      this.updateHoraFin();
    });
  }

  obtenerClientes() {
    this.clienteService.getClientes().subscribe((listaClientes) => {
      this.clienteService.getCliente(this.idGerente).subscribe((gerente=>{
        this.idGerente=gerente.id_sucursal
        this.listaClientes = listaClientes.filter(e=>e.id_sucursal==this.idGerente);
      }))

      
    });
  }

  obtenerSucursal(id: number) {
    this.sucursalService.getSucursal(id).subscribe((sucursal) => {
      this.sucursal = sucursal;
      this.citaForm.patchValue({
        sucursal: sucursal.nombre,
        id_sucursal:sucursal.id
      });
      this.SelectedSucursal=sucursal.id
    });
  }

  obtenerServicios() {
    this.servicioService.getServices().subscribe((listaServicios) => {
      this.listaServicios = listaServicios;
    });
  }

  obtenerMascotasCliente(id:number){
    this.mascotaService.getMascotasClientes(id).subscribe((ListaMascotas)=>{
      this.ListaMascotas=ListaMascotas
    })
  }

  

  formatDuration(duration: string): string {
    const time = new Date(duration);
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();
    return `${hours}h ${minutes}m`;
  }

  updateHoraFin(): void {
    const horaInicio = this.citaForm.get('hora_inicio').value;
    if (horaInicio && this.selectedServicio) {
      const [hours, minutes] = horaInicio.split(':').map(Number);
      const duration = new Date(this.selectedServicio.tiempo_servicio);
      const durHours = duration.getUTCHours();
      const durMinutes = duration.getUTCMinutes();
      const endTime = new Date();
      endTime.setHours(hours + durHours, minutes + durMinutes);

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
      console.log(reserva);
      
      this.citaService.postCita(reserva).subscribe( ()=> {
        this.dialogRef.close(true);
      },
      error => {
        console.log(error.error);
        
        this.formValidation.mensajeError(error.error, 'Agregar');
      })
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
}
