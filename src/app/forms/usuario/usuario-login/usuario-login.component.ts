import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../share/services/usuario.service';

@Component({
  selector: 'app-usuario-login',
  templateUrl: './usuario-login.component.html',
  styleUrl: './usuario-login.component.css'
})
export class UsuarioLoginComponent implements OnInit{


  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService:UsuarioService
  ) {
    this.loginForm = this.fb.group({
      correo_electronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}


  onSubmit() {
    if (this.loginForm.valid) {
      // Lógica para manejar el inicio de sesión
      console.log(this.loginForm.value);
    }
  }


}
