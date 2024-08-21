import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../share/services/usuario.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router'
import { FormvalidationsService } from '../../../share/formvalidations.service';
import { AuthService } from '../../../share/services/auth.service';
import { CarritoService } from '../../../share/services/carrito.service';
@Component({
  selector: 'app-usuario-login',
  templateUrl: './usuario-login.component.html',
  styleUrl: './usuario-login.component.css'
})
export class UsuarioLoginComponent implements OnInit {


  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private formuarioService: FormvalidationsService,
    private authService: AuthService,
    private carritoservice: CarritoService
  ) {
    this.loginForm = this.fb.group({
      correo_electronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.loginForm.valid) {
      this.usuarioService.postClienteLogin(this.loginForm.value).subscribe({
        next: (response: any) => {
          // Guardar el token en localStorage
          const token = response.token;

          console.log(token);

          // Decodificar el token para obtener la información del usuario
          const decodedToken: any = jwtDecode(token);

          console.log(decodedToken);

          // Usar AuthService para manejar el estado del usuario
          this.authService.login({
            id: decodedToken.id,
            nombre: decodedToken.nombre,
            correo_electronico: decodedToken.correo_electronico,
            rol: decodedToken.rol,
            id_sucursal: decodedToken.sucursal
          });

          this.formuarioService.mensajeExito('Login exitoso', 'Inicio de sesión');

          this.carritoservice.cargarCitasManana()

          console.log(decodedToken.rol);

          if (decodedToken.rol == 'administrador') {
            this.router.navigate(['/reportes']);
          } else {
            // Redirigir a la página de inicio
            this.router.navigate(['/inicio']);
          }


        },
        error: (err) => {
          console.log(err.error.message);
          this.formuarioService.mensajeError(err.error.message, 'Inicio de sesión');
        }
      });
    }
  }
}




