import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../share/services/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  nombre: string = '';
  correo: string = '';
  rol: string = '';

  constructor(private router: Router,private authService: AuthService) { } 

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.nombre = user.nombre;
        this.correo = user.correo_electronico;
        this.rol = user.rol;
      } else {
        this.nombre = '';
        this.correo = '';
        this.rol = '';
      }
    });
  }

  irAcerca(){
    this.router.navigate(['acerca'])
  }

  irinicio(){
    this.router.navigate(['/'])
  }

  irProducto(){
    this.router.navigate(['productos'])
  }
  
  irServicios(){
    this.router.navigate(['listaServicios'])
  }

  irFactura(){
    this.router.navigate(['factura'])
  }
  
  irCitasEncargado(){
    this.router.navigate(['listaCitasEncargado'])
  }
  


  irMantenimientoServices(){
    this.router.navigate(['tablaServicios'])
  }

  irMantenimientoProductos(){
    this.router.navigate(['tablaProductos'])
  }

  irMantenimientoSucursales(){
    this.router.navigate(['tablaSucursales'])
  }

  irMantenimientoHorarios(){
    this.router.navigate(['tablabBloqueoHorario'])
  }

  irMantenimientoUsuarios(){
    this.router.navigate(['TablaUsuarios'])
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
