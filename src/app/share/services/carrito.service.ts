// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CarritoService {
//   private carritoProductos = new BehaviorSubject<any[]>(this.obtenerCarritoProductos());
//   private carritoServicios = new BehaviorSubject<any[]>(this.obtenerCarritoServicios());

//   carritoProductos$ = this.carritoProductos.asObservable();
//   carritoServicios$ = this.carritoServicios.asObservable();

//   agregarProducto(producto: any) {
//     const productosActuales = this.obtenerCarritoProductos();
//     const index = productosActuales.findIndex(item => item.id === producto.id);

//     if (index === -1) {
//       productosActuales.push(producto);
//       this.guardarCarritoProductos(productosActuales);
//       this.carritoProductos.next(productosActuales);
//     }
//   }

//   agregarServicio(servicio: any) {
//     const serviciosActuales = this.obtenerCarritoServicios();
//     const index = serviciosActuales.findIndex(item => item.id === servicio.id);

//     if (index === -1) {
//       serviciosActuales.push(servicio);
//       this.guardarCarritoServicios(serviciosActuales);
//       this.carritoServicios.next(serviciosActuales);
//     }
//   }

//   obtenerCarritoProductos(): any[] {
//     return JSON.parse(localStorage.getItem('carrito')) || [];
//   }

//   obtenerCarritoServicios(): any[] {
//     return JSON.parse(localStorage.getItem('selectedServices')) || [];
//   }

//   guardarCarritoProductos(productos: any[]) {
//     localStorage.setItem('carrito', JSON.stringify(productos));
//   }

//   guardarCarritoServicios(servicios: any[]) {
//     localStorage.setItem('selectedServices', JSON.stringify(servicios));
//   }

//   eliminarProducto(productId: number) {
//     let productosActuales = this.obtenerCarritoProductos();
//     productosActuales = productosActuales.filter(item => item.id !== productId);
//     this.guardarCarritoProductos(productosActuales);
//     this.carritoProductos.next(productosActuales);
//   }

//   eliminarServicio(servicioId: number) {
//     let serviciosActuales = this.obtenerCarritoServicios();
//     serviciosActuales = serviciosActuales.filter(item => item.id !== servicioId);
//     this.guardarCarritoServicios(serviciosActuales);
//     this.carritoServicios.next(serviciosActuales);
//   }

//   vaciarCarrito() {
//     localStorage.removeItem('carrito');
//     localStorage.removeItem('selectedServices');
//     localStorage.removeItem('currentInvoiceId');
//     this.carritoProductos.next([]);
//     this.carritoServicios.next([]);
//   }

//   obtenerNumeroDeItems(): number {
//     const productosCount = this.obtenerCarritoProductos().length;
//     const serviciosCount = this.obtenerCarritoServicios().length;
//     return productosCount + serviciosCount;
//   }

//   productoEnCarrito(productId: number): boolean {
//     const productosActuales = this.obtenerCarritoProductos();
//     return productosActuales.some(item => item.id === productId);
//   }

//   servicioEnCarrito(servicioId: number): boolean {
//     const serviciosActuales = this.obtenerCarritoServicios();
//     return serviciosActuales.some(item => item.id === servicioId);
//   }

//   actualizarProducto(producto: any) {
//     const productosActuales = this.obtenerCarritoProductos();
//     const index = productosActuales.findIndex(item => item.id === producto.id);

//     if (index !== -1) {
//       productosActuales[index] = producto;
//       this.guardarCarritoProductos(productosActuales);
//       this.carritoProductos.next(productosActuales);
//     }
//   }

//   actualizarServicio(servicio: any) {
//     const serviciosActuales = this.obtenerCarritoServicios();
//     const index = serviciosActuales.findIndex(item => item.id === servicio.id);

//     if (index !== -1) {
//       serviciosActuales[index] = servicio;
//       this.guardarCarritoServicios(serviciosActuales);
//       this.carritoServicios.next(serviciosActuales);
//     }
//   }


//   obtenerusuario(): any {
//     return JSON.parse(localStorage.getItem('user')) || {};
//   }

// }


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CitasService } from './citas.service'; // Importa el servicio de citas
import { Cita } from '../interfaces/cita';
import { FormvalidationsService } from '../formvalidations.service';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoProductos = new BehaviorSubject<any[]>(this.obtenerCarritoProductos());
  private carritoServicios = new BehaviorSubject<any[]>(this.obtenerCarritoServicios());

  carritoProductos$ = this.carritoProductos.asObservable();
  carritoServicios$ = this.carritoServicios.asObservable();

  private citasPendientesCount = new BehaviorSubject<number>(0);
  citasPendientesCount$ = this.citasPendientesCount.asObservable();

  private citasManana = new BehaviorSubject<Cita[]>(this.obtenerCitasManana());
  citasManana$ = this.citasManana.asObservable();

  constructor(private citasService: CitasService,private formservice:FormvalidationsService) {
    // Actualizar el contador y las citas al inicializar el servicio
    this.actualizarCitasPendientesCount();
    this.cargarCitasManana();
  }

  agregarProducto(producto: any) {
    const productosActuales = this.obtenerCarritoProductos();
    const index = productosActuales.findIndex(item => item.id === producto.id);

    if (index === -1) {
      productosActuales.push(producto);
      this.guardarCarritoProductos(productosActuales);
      this.carritoProductos.next(productosActuales);
    }
  }

  agregarServicio(servicio: any) {
    const serviciosActuales = this.obtenerCarritoServicios();
    const index = serviciosActuales.findIndex(item => item.id === servicio.id);

    if (index === -1) {
      serviciosActuales.push(servicio);
      this.guardarCarritoServicios(serviciosActuales);
      this.carritoServicios.next(serviciosActuales);
    }
  }

  obtenerCarritoProductos(): any[] {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  }

  obtenerCarritoServicios(): any[] {
    return JSON.parse(localStorage.getItem('selectedServices')) || [];
  }

  guardarCarritoProductos(productos: any[]) {
    localStorage.setItem('carrito', JSON.stringify(productos));
  }

  guardarCarritoServicios(servicios: any[]) {
    localStorage.setItem('selectedServices', JSON.stringify(servicios));
  }

  eliminarProducto(productId: number) {
    let productosActuales = this.obtenerCarritoProductos();
    productosActuales = productosActuales.filter(item => item.id !== productId);
    this.guardarCarritoProductos(productosActuales);
    this.carritoProductos.next(productosActuales);
  }

  eliminarServicio(servicioId: number) {
    let serviciosActuales = this.obtenerCarritoServicios();
    serviciosActuales = serviciosActuales.filter(item => item.id !== servicioId);
    this.guardarCarritoServicios(serviciosActuales);
    this.carritoServicios.next(serviciosActuales);
  }

  vaciarCarrito() {
    localStorage.removeItem('carrito');
    localStorage.removeItem('selectedServices');
    localStorage.removeItem('currentInvoiceId');
    this.carritoProductos.next([]);
    this.carritoServicios.next([]);
  }

  obtenerNumeroDeItems(): number {
    const productosCount = this.obtenerCarritoProductos().length;
    const serviciosCount = this.obtenerCarritoServicios().length;
    return productosCount + serviciosCount;
  }

  productoEnCarrito(productId: number): boolean {
    const productosActuales = this.obtenerCarritoProductos();
    return productosActuales.some(item => item.id === productId);
  }

  servicioEnCarrito(servicioId: number): boolean {
    const serviciosActuales = this.obtenerCarritoServicios();
    return serviciosActuales.some(item => item.id === servicioId);
  }

  actualizarProducto(producto: any) {
    const productosActuales = this.obtenerCarritoProductos();
    const index = productosActuales.findIndex(item => item.id === producto.id);

    if (index !== -1) {
      productosActuales[index] = producto;
      this.guardarCarritoProductos(productosActuales);
      this.carritoProductos.next(productosActuales);
    }
  }

  actualizarServicio(servicio: any) {
    const serviciosActuales = this.obtenerCarritoServicios();
    const index = serviciosActuales.findIndex(item => item.id === servicio.id);

    if (index !== -1) {
      serviciosActuales[index] = servicio;
      this.guardarCarritoServicios(serviciosActuales);
      this.carritoServicios.next(serviciosActuales);
    }
  }

  obtenerusuario(): any {
    return JSON.parse(localStorage.getItem('user')) || {};
  }

  // Nuevo método para obtener y actualizar el contador de citas pendientes
  actualizarCitasPendientesCount() {
    const usuario = this.obtenerusuario();

    if (usuario.id) {
      this.citasService.obtenerCitasParaMananaPorCliente(usuario.id).subscribe((citas) => {
        this.citasPendientesCount.next(citas.length);
        this.guardarCitasManana(citas);
      });
    }
  }

  // Método para disminuir el contador cuando se elimina una cita pendiente
  disminuirCitasPendientesCount() {
    const currentCount = this.citasPendientesCount.value;
    if (currentCount > 0) {
      this.citasPendientesCount.next(currentCount - 1);
    }
  }

  // Guardar y obtener citas de mañana en local storage
  guardarCitasManana(citas: Cita[]) {
    localStorage.setItem('citasManana', JSON.stringify(citas));
    this.citasManana.next(citas);
  }

  obtenerCitasManana(): Cita[] {
    return JSON.parse(localStorage.getItem('citasManana')) || [];
  }

  // Método para cargar citas desde la API y actualizar el local storage
  cargarCitasManana() {
    this.actualizarCitasPendientesCount();
  }

  // Método para confirmar una cita y actualizar la base de datos
  confirmarCita(cita: Cita) {
    cita.estado = 'Confirmada';
    return this.citasService.confirmarCita(cita.id, cita).subscribe(() => {
      const citasActuales = this.obtenerCitasManana().filter(c => c.id !== cita.id);
      this.guardarCitasManana(citasActuales);
      this.actualizarCitasPendientesCount();
      this.formservice.mensajeExito('se ha confirmado su cita','confimrmacion')
    });
  }
}
