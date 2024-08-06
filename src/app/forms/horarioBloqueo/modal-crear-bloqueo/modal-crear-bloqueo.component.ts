import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaSucursales } from '../../../share/interfaces/sucursal';
import { HorariobloqueoService } from '../../../share/services/horariobloqueo.service';
import { SucursalService } from '../../../share/services/sucursal.service';
import { FormvalidationsService } from '../../../share/formvalidations.service';

@Component({
  selector: 'app-modal-crear-bloqueo',
  templateUrl: './modal-crear-bloqueo.component.html',
  styleUrls: ['./modal-crear-bloqueo.component.css']
})
export class ModalCrearBloqueoComponent implements OnInit {

  bloqueoForm: FormGroup;
  sucursales: any[] = [];
  diasSemana: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  tiposRepeticion: string[] = ['Ninguno', 'Diario', 'Semanal', 'Mensual'];

  constructor(
    private fb: FormBuilder,
    private horarioService: HorariobloqueoService,
    private sucursalservice: SucursalService,
    public dialogRef: MatDialogRef<ModalCrearBloqueoComponent>,
    public formvalidadation: FormvalidationsService
  ) {
    this.bloqueoForm = this.fb.group({
      fecha: ['', Validators.required],
      dia_semana: [{ value: '', disabled: true }, Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      id_sucursal: ['', Validators.required],
      repeticion: ['', Validators.required]
    }, { validator: this.timeRangeValidator });
  }

  ngOnInit(): void {
    this.sucursalservice.getSucursales().subscribe(data => {
      this.sucursales = data;
    });

    this.bloqueoForm.get('fecha').valueChanges.subscribe(value => {
      if (value) {
        const fecha = new Date(value);
        const diaSemana = this.diasSemana[fecha.getDay()];
        this.bloqueoForm.get('dia_semana').setValue(diaSemana);
      }
    });
  }


  // dateFilter = (d: Date | null): boolean => {
  //   const today = new Date();
  //   const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  //   return d >= tomorrow;
  // }


  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar la hora y comparar solo la fecha
    if (d) {
      d.setHours(0, 0, 0, 0); // Ignorar la hora y comparar solo la fecha
      return d >= today;
    }
    return false;
  }



  onSubmit() {
    if (this.bloqueoForm.valid) {
      const formValues = this.bloqueoForm.getRawValue(); // Usamos getRawValue para incluir el campo deshabilitado

      const fecha = new Date(formValues.fecha);
      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0); // Ignorar la hora y comparar solo la fecha
      fecha.setHours(0, 0, 0, 0); // Ignorar la hora y comparar solo la fecha

      if (fecha < fechaActual) {
        this.formvalidadation.mensajeError("La fecha debe ser actual o futura", 'Agregar');
        return;
      }

      const horaInicioParts = formValues.hora_inicio.split(':');
      const horaFinParts = formValues.hora_fin.split(':');

      const horaInicio = new Date(fecha);
      horaInicio.setHours(parseInt(horaInicioParts[0]), parseInt(horaInicioParts[1]));

      const horaFin = new Date(fecha);
      horaFin.setHours(parseInt(horaFinParts[0]), parseInt(horaFinParts[1]));

      const bloqueoData = {
        ...formValues,
        hora_inicio: horaInicio.toISOString(),
        hora_fin: horaFin.toISOString(),
      };

      this.horarioService.createBloqueo(bloqueoData).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        error => {
          this.formvalidadation.mensajeError(error.error, 'Error al agregar')
        }
      );
    }
  }

  isFieldInvalid(field: string): boolean {
    return this.formvalidadation.isFieldInvalid(this.bloqueoForm, field);
  }

  getErrorMessage(field: string): string {
    return this.formvalidadation.getErrorMessage(this.bloqueoForm, field);
  }

  timeRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const hora_inicio = group.get('hora_inicio').value;
    const hora_fin = group.get('hora_fin').value;

    if (hora_inicio && hora_fin) {
      const [horaInicioHours, horaInicioMinutes] = hora_inicio.split(':').map(Number);
      const [horaFinHours, horaFinMinutes] = hora_fin.split(':').map(Number);

      if (horaInicioHours > horaFinHours || (horaInicioHours === horaFinHours && horaInicioMinutes >= horaFinMinutes)) {
        return { 'timeRangeInvalid': true };
      }
    }
    return null;
  }

}
