import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DetallefacturaService } from '../../share/services/detallefactura.service';
import {
  DetalleFactura,
  DetallesFactura,
} from '../../share/interfaces/detalle-factura';
import { Sucursal } from '../../share/interfaces/sucursal';
import { Cliente } from '../../share/interfaces/cliente';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrl: './detalle-factura.component.css',
})
export class DetalleFacturaComponent implements OnInit {
  displayedColumnsProduct: string[] = ['nombre', 'cantidad', 'precio', 'subtotal', 'iva', 'totalConIVA'];
  displayedColumnsService: string[] = ['nombre','especialidad', 'tarifa', 'subtotal', 'iva', 'totalConIVA'];
  Id: number;
  detallesfactura: DetallesFactura;
  Sucursal: Sucursal;
  Cliente: Cliente;
  subtotal: number = 0;
  productos: DetalleFactura[] = [];
  servicios: DetalleFactura[] = [];
  totalGeneral: number = 0;
  ivaRate = 0.13;
  FechaFactura: Date;
  constructor(
    private route: ActivatedRoute,
    private service: DetallefacturaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id');
      if (id) {
        this.service.getDetallesFactura(id).subscribe((data) => {
          this.detallesfactura = data;
          this.FechaFactura = this.detallesfactura[0].factura.fecha_factura;
          this.Sucursal = this.detallesfactura[0].factura.cita.sucursal;
          this.Cliente = this.detallesfactura[0].factura.cita.cliente;

          this.productos = data.filter((item) => item.producto != null);
          this.servicios = data.filter((item) => item.servicio != null);

          this.calcularTotalGeneral();
        });
      }
    });
  }

  calcularSubtotalProducto(producto: DetalleFactura): number {
    return producto.cantidad * producto.producto.precio;
  }

  calcularSubtotalServicio(servicio: DetalleFactura): number {
    return servicio.servicio.tarifa;
  }

  calcularIVA(monto: number): number {
    return monto * this.ivaRate;
  }

  calcularTotalConIVA(monto: number): number {
    return monto + this.calcularIVA(monto);
  }

  calcularTotalGeneral() {
    this.totalGeneral = 0;
    this.productos.forEach(producto => {
      const subtotal = this.calcularSubtotalProducto(producto);
      this.totalGeneral += subtotal + this.calcularIVA(subtotal);
    });
    this.servicios.forEach(servicio => {
      const subtotal = this.calcularSubtotalServicio(servicio);
      this.totalGeneral += subtotal + this.calcularIVA(subtotal);
    });


  }
}
