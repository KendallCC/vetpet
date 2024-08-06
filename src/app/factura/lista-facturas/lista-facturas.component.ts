import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FacturaService } from '../../share/services/factura.service';
import { Factura, listaFactura } from '../../share/interfaces/factura';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html',
  styleUrl: './lista-facturas.component.css',
})
export class ListaFacturasComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'fecha_factura', 'total', 'estado','opciones'];
  dataSource: MatTableDataSource<Factura>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public ListFactura: listaFactura = [];
  constructor(private service: FacturaService,private router: Router) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.ListFactura);


    
  }

  ngAfterViewInit(): void {
    this.getFacturas();
  }

  getFacturas() {
    this.service.getFacturas().subscribe({
      next: (result) => {
        this.ListFactura = result;
        this.dataSource = new MatTableDataSource(this.ListFactura);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  irDetalle(id:number){
    this.router.navigate([`detallefactura/${id}`])
  }
}
