import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../../../share/services/services.service';
import { listaServicios, Servicio } from '../../../share/interfaces/servicio';
import { Router } from '@angular/router';
import { getUTCDateTime } from '../../../share/Utils';
import { MatDialog } from '@angular/material/dialog';
import { ModalAgregarEditarComponent } from '../modal-agregar-editar/modal-agregar-editar.component';
import { FormvalidationsService } from '../../../share/formvalidations.service';
@Component({
  selector: 'app-tabla-servicios',
  templateUrl: './tabla-servicios.component.html',
  styleUrl: './tabla-servicios.component.css',
})
export class TablaServiciosComponent implements OnInit {
  ListaServicios: listaServicios;
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'tarifa',
    'tiempo_servicio',
    'Tipo_mascota',
    'Especialidad',
    'opciones',
  ];
  dataSource: MatTableDataSource<Servicio>;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private services: ServicesService,
    private mensaje:FormvalidationsService
  ) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.obtenerServicios();
  }

  obtenerServicios() {
    this.services.getServices().subscribe((data) => {
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
    this.router.navigate(['detallServicio/' + id]);
  }

  registrarActalizar(id?: Number): void {
    const dialogRef = this.dialog.open(ModalAgregarEditarComponent, {
      width: '550px',
      disableClose: true,
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerServicios();
    });
  }

  eliminar(id: number){
    console.log('dato',id);
    
  this.services.deleteService(id).subscribe(()=>{
    this.mensaje.mensajeExito("Se a Eliminado con exito","Eliminacion Exitosa")
    this.obtenerServicios();
  })
  }

}
