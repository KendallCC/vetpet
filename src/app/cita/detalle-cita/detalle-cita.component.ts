import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../share/interfaces/cliente';
import { Servicio } from '../../share/interfaces/servicio';
import { Sucursal } from '../../share/interfaces/sucursal';
import { Mascota } from '../../share/interfaces/mascota';
import { Producto } from '../../share/interfaces/product';
import { ActivatedRoute } from '@angular/router';
import { CitasService } from '../../share/services/citas.service';
import { Cita, Factura } from '../../share/interfaces/cita';

@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.css']
})
export class DetalleCitaComponent implements OnInit {
  Id: number;
  cliente: Cliente;
  servicios: Servicio[] = [];
  sucursal: Sucursal;
  mascota: Mascota;
  cita: Cita;
  fechaFactura: string;

  constructor(private route: ActivatedRoute, private service: CitasService) {}

  ngOnInit(): void {
    this.obtenerCita();
  }

  obtenerCita() {
    this.route.paramMap.subscribe(params => {
      this.Id = parseInt(params.get('id'), 10);
      console.log('el id que llega es:' + this.Id);

      if (this.Id !== null) {
        this.service.getCita(this.Id).subscribe(data => {
          this.cita = data;
          this.cliente = data.cliente;
          this.sucursal = data.sucursal;
          this.mascota = data.mascota;
          if (data.facturas && data.facturas.length > 0) {
            this.fechaFactura = data.facturas[0].fecha_factura;
            this.servicios = data.facturas.flatMap(factura =>
              factura.detalle_factura.map(detalle => detalle.servicio)
            ).filter(servicio => servicio !== undefined);
          }
          console.log(data);
          
          console.log(this.servicios);
          
          
        });
      }
    });
  }

  formatDuration(duration: string): string {
    const time = new Date(duration);
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();
    return `${hours}h ${minutes}m`;
  }
}
