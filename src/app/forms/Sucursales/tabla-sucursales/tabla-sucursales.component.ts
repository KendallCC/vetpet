import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ListaSucursales, Sucursal } from '../../../share/interfaces/sucursal';
import { SucursalService } from '../../../share/services/sucursal.service';
import { FormvalidationsService } from '../../../share/formvalidations.service';
import { ModalAgregarEditarSucursalComponent } from '../modal-agregar-editar-sucursal/modal-agregar-editar-sucursal.component';

@Component({
  selector: 'app-tabla-sucursales',
  templateUrl: './tabla-sucursales.component.html',
  styleUrl: './tabla-sucursales.component.css'
})
export class TablaSucursalesComponent implements OnInit{
  ListaServicios: ListaSucursales;
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'telefono',
    'direccion',
    'correo_electronico',
    'opciones',
  ];
  dataSource: MatTableDataSource<Sucursal>;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private services: SucursalService,
    private mensaje:FormvalidationsService
  ) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.obtenerServicios();
  }

  obtenerServicios() {
    this.services.getSucursales().subscribe((data) => {
      this.ListaServicios = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort; 
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  detalle(id: number) {
    this.router.navigate(['detalleSucursal/' + id]);
  }

  registrarActalizar(id?: Number): void {
    const dialogRef = this.dialog.open(ModalAgregarEditarSucursalComponent, {
      width: '550px',
      disableClose: true,
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerServicios();
    });
  }

  eliminar(id: number){
  this.services.deleteSucursal(id).subscribe(()=>{
    this.mensaje.mensajeExito("Se a Eliminado con exito","Eliminacion Exitosa")
    this.obtenerServicios();
  })
  }



}
