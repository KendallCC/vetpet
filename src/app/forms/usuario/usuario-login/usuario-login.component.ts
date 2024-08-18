import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../share/services/usuario.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router'
@Component({
  selector: 'app-usuario-login',
  templateUrl: './usuario-login.component.html',
  styleUrl: './usuario-login.component.css'
})
export class UsuarioLoginComponent implements OnInit{


  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService:UsuarioService,
    private router: Router,
    
  ) {
    this.loginForm = this.fb.group({
      correo_electronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}


  onSubmit() {
    if (this.loginForm.valid) {
      this.usuarioService.postClienteLogin(this.loginForm.value).subscribe({
        next: (response:any) => {
          // Guardar el token en localStorage

          const token = response.token;

          console.log(token);
          
          // Decodificar el token para obtener la información del usuario
          const decodedToken:any = jwtDecode(token);
          
          // Guardar la información del usuario en localStorage
          localStorage.setItem('user', JSON.stringify({
            id: decodedToken.id,
            nombre: decodedToken.nombre,
            correo_electronico: decodedToken.correo_electronico,
            rol: decodedToken.rol
          }));

          // Redirigir a la página de inicio
          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          console.error('Error de autenticación:', err);
          // Mostrar un mensaje de error o manejar el error de otra manera
        }
      });
    }
  }
}
  



