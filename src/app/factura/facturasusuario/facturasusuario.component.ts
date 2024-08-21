import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaService } from '../../share/services/factura.service';
import { Factura, listaFactura } from '../../share/interfaces/factura';
import { CarritoService } from '../../share/services/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facturasusuario',
  templateUrl: './facturasusuario.component.html',
  styleUrls: ['./facturasusuario.component.css']
})
export class FacturasusuarioComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'fecha_factura', 'total', 'estado', 'opciones'];
  dataSource: MatTableDataSource<Factura>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private facturaService: FacturaService,
    private carritoService: CarritoService,
    private router:Router
  ) {
    this.dataSource = new MatTableDataSource<Factura>();
  }

  ngOnInit(): void {
    this.loadUserFacturas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUserFacturas() {
    const user = this.carritoService.obtenerusuario();
    const userId = user.id;

    if (userId) {
      this.facturaService.getFacturas().subscribe({
        next: (result) => {
          const userFacturas = result.filter((factura) => factura.cita.cliente.id === userId);
          this.dataSource.data = userFacturas;
        },
        error: (error) => {
          console.error('Error al cargar las facturas del usuario:', error);
        }
      });
    } else {
      console.error('No se encontró el ID del usuario en localStorage.');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  irDetalle(id: number) {
    // Navega a la página de detalles de una factura específica.
    this.router.navigate([`detallefactura/${id}`]);
  }
}
