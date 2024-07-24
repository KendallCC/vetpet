import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SucursalService } from '../../../share/services/sucursal.service';
import { HorariobloqueoService } from '../../../share/services/horariobloqueo.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalCrearHorarioComponent } from '../modal-crear-horario/modal-crear-horario.component';
import { ModalCrearBloqueoComponent } from '../modal-crear-bloqueo/modal-crear-bloqueo.component';

@Component({
  selector: 'app-tabla-bloqueo-horario',
  templateUrl: './tabla-bloqueo-horario.component.html',
  styleUrls: ['./tabla-bloqueo-horario.component.css']
})
export class TablaBloqueoHorarioComponent implements OnInit, AfterViewInit {
  sucursales: any[] = [];
  selectedSucursal: number;
  displayedColumns: string[] = ['fecha', 'hora_inicio', 'hora_fin', 'bloqueo', 'opciones'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private sucursalService: SucursalService,
    private horarioService: HorariobloqueoService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.obtenerSucursales();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSucursalChange(idSucursal: number) {
    this.horarioService.getHorariosYBloqueosPorSucursal(idSucursal).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator; // Asegurar que se setea después de obtener los datos
    });
  }

  obtenerSucursales() {
    this.sucursalService.getSucursales().subscribe(data => {
      this.sucursales = data;
    });
  }

  openCrearHorarioDialog() {
    const dialogRef = this.dialog.open(ModalCrearHorarioComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSucursalChange(this.selectedSucursal);
      }
    });
  }

  openCrearBloqueoDialog() {
    const dialogRef = this.dialog.open(ModalCrearBloqueoComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSucursalChange(this.selectedSucursal);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
