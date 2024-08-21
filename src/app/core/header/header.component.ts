import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../share/services/auth.service';
import { CarritoService } from '../../share/services/carrito.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  nombre: string = '';
  correo: string = '';
  rol: string = '';
  carritoCount: number = 0;
  citasPendientesCount: number = 0;
  constructor(
    private router: Router,
    private authService: AuthService,
    private carritoService: CarritoService
  ) { }

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

    this.carritoService.citasPendientesCount$.subscribe(count => {
      this.citasPendientesCount = count;
    });

    // Suscribirse a los observables del carrito para productos y servicios
    combineLatest([
      this.carritoService.carritoProductos$,
      this.carritoService.carritoServicios$
    ]).subscribe(([productos, servicios]) => {
      this.carritoCount = productos.length + servicios.length;
    });
  }

  irCarrito() {
    this.router.navigate(['carrito']);
  }

  irNotificaciones(){
    this.router.navigate(['notificaciones']);
  }

  irAcerca() {
    this.router.navigate(['acerca']);
  }

  irinicio() {
    this.router.navigate(['/']);
  }

  irProducto() {
    this.router.navigate(['productos']);
  }

  irServicios() {
    this.router.navigate(['listaServicios']);
  }

  irFactura() {
    this.router.navigate(['factura']);
  }

  irFacturaCliente() {
    this.router.navigate(['Clientefacturas']);
  }



  irCitasEncargado() {
    this.router.navigate(['listaCitasEncargado']);
  }

  irCitasCliente() {
    this.router.navigate(['agendacita']);
  }


  

  irMantenimientoServices() {
    this.router.navigate(['tablaServicios']);
  }

  irMantenimientoProductos() {
    this.router.navigate(['tablaProductos']);
  }

  irMantenimientoSucursales() {
    this.router.navigate(['tablaSucursales']);
  }

  irMantenimientoHorarios() {
    this.router.navigate(['tablabBloqueoHorario']);
  }

  irMantenimientoUsuarios() {
    this.router.navigate(['TablaUsuarios']);
  }

  irReporte() {
    this.router.navigate(['reportes']);
  }

  logout() {
    this.authService.logout();
    this.carritoService.vaciarCarrito();
    this.carritoService.logout()
    this.router.navigate(['/login']);
  }
}
