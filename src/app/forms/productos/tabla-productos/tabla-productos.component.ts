import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../../../share/services/services.service';
import { Router } from '@angular/router';
import { getUTCDateTime } from '../../../share/Utils';
import { MatDialog } from '@angular/material/dialog';

import { FormvalidationsService } from '../../../share/formvalidations.service';
import { ListaProductos, Producto } from '../../../share/interfaces/product';
import { ProductService } from '../../../share/services/product.service';
import { ModalAgregarEditarProdComponent } from '../modal-agregar-editar-prod/modal-agregar-editar-prod.component';

@Component({
  selector: 'app-tabla-productos',
  templateUrl: './tabla-productos.component.html',
  styleUrl: './tabla-productos.component.css'
})
export class TablaProductosComponent implements OnInit{

  ListaServicios: ListaProductos;
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'categoria',
    'precio',
    'Tipo_mascota',
    'Marca',
    'opciones',
  ];
  dataSource: MatTableDataSource<Producto>;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private services: ProductService,
    private mensaje:FormvalidationsService
  ) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.obtenerServicios();
  }

  obtenerServicios() {
    this.services.getProducts().subscribe((data) => {
      this.ListaServicios = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator; // Mover la asignación de paginator aquí
      this.dataSource.sort = this.sort; // Mover la asignación de sort aquí
    });
  }

  getUTCDateTime(dateString: string): string {
    return getUTCDateTime(dateString);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  detalle(id: number) {
    this.router.navigate(['productos/' + id]);
  }

  registrarActalizar(id?: Number): void {
    const dialogRef = this.dialog.open(ModalAgregarEditarProdComponent, {
      width: '550px',
      disableClose: true,
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerServicios();
    });
  }

  eliminar(id: number){
  this.services.deleteProducto(id).subscribe(()=>{
    this.mensaje.mensajeExito("Se a Eliminado con exito","Eliminacion Exitosa")
    this.obtenerServicios();
  })
  }


}
