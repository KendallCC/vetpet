import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../../share/services/carrito.service'; // Ajusta la ruta del servicio
import { Cita } from '../../../share/interfaces/cita';

@Component({
  selector: 'app-notificacioncita',
  templateUrl: './notificacioncita.component.html',
  styleUrl: './notificacioncita.component.css'
})
export class NotificacioncitaComponent {
  citasManana: Cita[] = [];

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.citasManana$.subscribe(citas => {
      this.citasManana = citas;
    });
  }

  confirmarCita(cita: Cita): void {
    this.carritoService.confirmarCita(cita);
  }
}
