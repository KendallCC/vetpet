import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Servicio } from '../../../share/interfaces/servicio';
import { FormvalidationsService } from '../../../share/formvalidations.service'
import { ServicesService } from '../../../share/services/services.service';
@Component({
  selector: 'app-modal-agregar-editar',
  templateUrl: './modal-agregar-editar.component.html',
  styleUrl: './modal-agregar-editar.component.css',
})
export class ModalAgregarEditarComponent implements OnInit {
  selectedHour: number | null = null;
  selectedMinute: number | null = null;

  form: FormGroup;

  fecha: Date;

  operacion: string = 'Agregar '

  id: number | undefined
  constructor(
    public dialogRef: MatDialogRef<ModalAgregarEditarComponent>,
    private fb: FormBuilder,
    private validationService: FormvalidationsService,
    private service: ServicesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      tarifa: ['', [Validators.required, Validators.min(10000), Validators.pattern(/^[0-9]+$/)]],
      horas: ['0', [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      minutos: ['', [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^[0-9]+$/)]],
      mascota: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      especialidad: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    });
    this.id = data.id
  }

  ngOnInit(): void {
    this.esEditar(this.id)
  }


  esEditar(id: number | undefined) {
    if (id !== undefined) {
      this.operacion = 'Editar '
      this.getServicio(id)
    }
  }


  getServicio(id: number) {
    this.service.getService(id).subscribe(data => {

      const date = new Date(data.tiempo_servicio)
      this.fecha = date
      const hours = ('0' + date.getUTCHours()).slice(-2);
      const minutes = ('0' + date.getUTCMinutes()).slice(-2);

      this.form.setValue({
        nombre: data.nombre,
        descripcion: data.descripcion,
        tarifa: data.tarifa,
        horas: hours,
        minutos: minutes,
        mascota: data.Tipo_mascota,
        especialidad: data.Especialidad
      })
    })
  }


  cancelar() {
    this.dialogRef.close();
  }

  addEdit() {


    if (this.id == undefined) {

      const servicio: Servicio = {
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion,
        tarifa: this.form.value.tarifa,
        tiempo_servicio: this.fecha.toISOString(),
        Especialidad: this.form.value.especialidad,
        Tipo_mascota: this.form.value.mascota
      }

      this.service.postService(servicio).subscribe(() => {
        this.validationService.mensajeExito("se han agregado con exito los datos","Agregacion")
      })

    } else {

      const durationDate = new Date(
        Date.UTC(1970, 0, 1, this.form.value.horas, this.form.value.minutos)
      );

      const servicio: Servicio = {
        nombre: this.form.value.nombre,
        descripcion: this.form.value.descripcion,
        tarifa: this.form.value.tarifa,
        tiempo_servicio: durationDate.toISOString(),
        Especialidad: this.form.value.especialidad,
        Tipo_mascota: this.form.value.mascota
      }

      this.service.updateService(this.id, servicio).subscribe(() => {
        this.validationService.mensajeExito("se han actualizado con exito los datos","Actualizacion")
      })
    }
    this.dialogRef.close(true);

  }



  mensajeExito(operacion: string) {
    //!agregar mensaje
  }


  isFieldInvalid(field: string): boolean {
    return this.validationService.isFieldInvalid(this.form, field);
  }


  getErrorMessage(field: string): string {
    return this.validationService.getErrorMessage(this.form, field);
  }



  onHourChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedHour = parseInt(input.value, 10);
    this.updateDuration();
  }

  onMinuteChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedMinute = parseInt(input.value, 10);
    this.updateDuration();
  }

  updateDuration() {

    if (this.selectedHour !== null && this.selectedMinute !== null) {
      const durationDate = new Date(
        Date.UTC(1970, 0, 1, this.selectedHour, this.selectedMinute)
      );
      this.fecha = durationDate;
    }
  }
}
