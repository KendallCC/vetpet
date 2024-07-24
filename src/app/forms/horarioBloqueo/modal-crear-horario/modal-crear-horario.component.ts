import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaSucursales } from '../../../share/interfaces/sucursal';
import { HorariobloqueoService } from '../../../share/services/horariobloqueo.service';
import { SucursalService } from '../../../share/services/sucursal.service';
import { FormvalidationsService } from '../../../share/formvalidations.service';

@Component({
  selector: 'app-modal-crear-horario',
  templateUrl: './modal-crear-horario.component.html',
  styleUrls: ['./modal-crear-horario.component.css']
})
export class ModalCrearHorarioComponent implements OnInit {

  horarioForm: FormGroup;
  sucursales: ListaSucursales = [];
  diasSemana: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  tiposRepeticion: string[] = ['Ninguno', 'Diario', 'Semanal', 'Mensual'];

  constructor(
    private fb: FormBuilder,
    private horarioService: HorariobloqueoService,
    private sucursalservice: SucursalService,
    public formvalidadation: FormvalidationsService,
    public dialogRef: MatDialogRef<ModalCrearHorarioComponent>
  ) {
    this.horarioForm = this.fb.group({
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

    this.horarioForm.get('fecha').valueChanges.subscribe(value => {
      if (value) {
        const fecha = new Date(value);
        const diaSemana = this.diasSemana[fecha.getDay()];
        this.horarioForm.get('dia_semana').setValue(diaSemana);
      }
    });
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


  onSubmit() {
    if (this.horarioForm.valid) {
      const formValues = this.horarioForm.getRawValue(); // Usamos getRawValue para incluir el campo deshabilitado
      
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

      const horarioData = {
        ...formValues,
        hora_inicio: horaInicio.toISOString(),
        hora_fin: horaFin.toISOString(),
      };

      this.horarioService.createHorario(horarioData).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        error => {
          this.formvalidadation.mensajeError(error.error, 'Agregar');
        }
      );
    }
  }

  isFieldInvalid(field: string): boolean {
    return this.formvalidadation.isFieldInvalid(this.horarioForm, field);
  }

  getErrorMessage(field: string): string {
    return this.formvalidadation.getErrorMessage(this.horarioForm, field);
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
