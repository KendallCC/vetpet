import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../share/services/usuario.service';
import { Router } from '@angular/router';
import { SucursalService } from '../../../share/services/sucursal.service';
import { ListaSucursales } from '../../../share/interfaces/sucursal';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormvalidationsService } from '../../../share/formvalidations.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrl: './registrar-usuario.component.css'
})
export class RegistrarUsuarioComponent {
  registroForm: FormGroup;
  sucursales: ListaSucursales = [];

  constructor(
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private usuarioService:UsuarioService,
    private router:Router,
    private formvalidation:FormvalidationsService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/), Validators.minLength(8), Validators.maxLength(8)]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      id_sucursal: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.sucursalService.getSucursales().subscribe((data: ListaSucursales) => {
      this.sucursales = data;
    });
  }  


  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    if (date) {
      const isoDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
      this.registroForm.get('fecha_nacimiento')?.setValue(isoDate);
    }
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.usuarioService.postCliente(this.registroForm.value).subscribe({
        next: () => {
          this.formvalidation.mensajeExito('Usuario agregado con exito, ahora registrese','Registro Usuario')
          this.router.navigate(['/login']); // Redirige al login u otra página después de registrar el usuario
        },
        error: (e) => {
        
          this.formvalidation.mensajeError('Hubo un error verifique los datos o su correo electronico y asegurese de que no esta regitrado ya','Error Agregar')
          
        }
      });
    }
  }
}
