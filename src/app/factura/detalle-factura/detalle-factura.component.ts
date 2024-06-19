import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DetallefacturaService } from '../../share/services/detallefactura.service';
import { DetalleFactura, DetallesFactura} from '../../share/interfaces/detalle-factura';
import { Sucursal } from '../../share/interfaces/sucursal';
import { Cliente } from '../../share/interfaces/cliente';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrl: './detalle-factura.component.css',
})
export class DetalleFacturaComponent implements OnInit {
  displayedColumns: string[] = ['producto', 'nombre', 'cantidad', 'precioP', 'precioS', 'total'];

  Id: number;
  detallesfactura: DetallesFactura;
  Sucursal: Sucursal;
  Cliente: Cliente;
  subtotal:number=0;


  FechaFactura: Date;
  constructor(
    private route: ActivatedRoute,
    private service: DetallefacturaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.Id = parseInt(params.get('id'));

      if (this.Id !== null) {
        this.service.getDetallesFactura(this.Id).subscribe((data) => {
          this.detallesfactura = data;
          this.FechaFactura = this.detallesfactura[0].factura.fecha_factura;
          this.Sucursal = this.detallesfactura[0].factura.cita.sucursal;
          this.Cliente = this.detallesfactura[0].factura.cita.cliente;
          this.calculateSubtotal()
          console.log(data);
          
        });
      }
    });
  }


  // Método para calcular el subtotal de un elemento DetalleFactura
  calculateSubtotal() {
    this.subtotal = 0; // Reiniciar subtotal
    for (const detalle of this.detallesfactura) {
      if (detalle.producto) {
        this.subtotal += detalle.cantidad * detalle.producto.precio;
      }
      if (detalle.servicio) {
        this.subtotal += detalle.servicio.tarifa;
      }
    }
  }

  get totalCompra(): string {
    if (!this.detallesfactura) {
      return '0.00'; // Manejo de caso cuando detallesfactura aún no está definido
    }
  
    let suma = 0;
    for (const detalle of this.detallesfactura) {
      // Sumar el precio del producto si existe
      if (detalle.producto) {
        suma += detalle.cantidad * detalle.producto.precio;
      }
      // Sumar la tarifa del servicio solo si el servicio existe
      if (detalle.servicio && detalle.servicio.tarifa) {
        suma += detalle.servicio.tarifa;
      }
    }
  
    // Aplicar 13% de IVA
    const totalConIVA = suma * 1.13;
  
    // Formatear el resultado a dos decimales
    return totalConIVA.toFixed(2);
  }
}

