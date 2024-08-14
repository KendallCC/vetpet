import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class FormvalidationsService {

  constructor(private toastr: ToastrService) { }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && !control.valid && control.touched;
  }

  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control && control.errors) {
      const errors = Object.keys(control.errors);
      if (errors.length > 0) {
        const errorKey = errors[0];
        switch (errorKey) {
          case 'required':
            return 'Este campo es obligatorio';
          case 'minlength':
            const minLength = control.errors['minlength'].requiredLength;
            return `Debe tener al menos ${minLength} caracteres`;
          case 'maxlength':
            const maxLength = control.errors['maxlength'].requiredLength;
            return `No puede exceder de ${maxLength} caracteres`;
          case 'min':
            const min = control.errors['min'].min;
            return `Debe ser al menos ${min}`;
          case 'max':
            const max = control.errors['max'].max;
            return `No puede ser más de ${max}`;
            case 'email':
              const email = control.errors['email'].email;
              return `Correo electronico no valido`;  
          case 'pattern':
            return 'Solo se permiten números';
            case 'timeRangeInvalid':
              return 'La hora de inicio debe ser anterior a la hora de fin.';
          default:
            return '';
        }
      }
    }
    return '';
  }



  mensajeExito(mensaje: string, operacion: string) {

    this.toastr.success(mensaje, operacion, { positionClass: 'toast-top-center', progressBar: true, disableTimeOut: false })

  }

  mensajeError(mensaje: string, operacion: string) {

    this.toastr.error(mensaje, operacion, { positionClass: 'toast-top-center', progressBar: true, disableTimeOut: false })

  }

  


}
