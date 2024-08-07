import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CitasService } from '../../share/services/citas.service';
import { Cita, listaCitas } from '../../share/interfaces/cita';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../share/services/global.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AgregarEditarCitaComponent } from '../../forms/cita/agregar-editar-cita/agregar-editar-cita.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../share/services/usuario.service';
import { Cliente } from '../../share/interfaces/cliente';
import { MatSelectChange } from '@angular/material/select';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormvalidationsService } from '../../share/formvalidations.service';
import { Factura } from '../../share/interfaces/factura';

@Component({
  selector: 'app-lista-cita-encargados',
  templateUrl: './lista-cita-encargados.component.html',
  styleUrls: ['./lista-cita-encargados.component.css'],
})
export class ListaCitaEncargadosComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['id', 'fecha_cita', 'hora_cita', 'estado', 'opciones'];
  dataSource: MatTableDataSource<Cita>;
  listaEncargado: Cita[] = [];
  ListaClientes: Cliente[] = [];
  variableGlobal: number;
  idSucursal: number;
  private subscription: Subscription;
  factura:Factura;
  Sucursal: string = "";

  constructor(
    private Citaservice: CitasService,
    private clienteService: UsuarioService,
    private globalService: GlobalService,
    private router: Router,
    public dialog: MatDialog,
    public notificacion:FormvalidationsService
  ) {
    this.dataSource = new MatTableDataSource(this.listaEncargado);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.obtenerCitas();
  }

  ngOnInit(): void {
    this.suscripcionVariableGlobal();
    this.obtenerEncargado();
  }

  suscripcionVariableGlobal() {
    this.subscription = this.globalService.IdEncargado$.subscribe((value) => {
      this.variableGlobal = value;
      console.log('Valor de variableGlobal actualizado:', this.variableGlobal);
    });
  }

  obtenerEncargado() {
    this.clienteService.getCliente(this.variableGlobal).subscribe(encargado => {
      this.idSucursal = encargado.id_sucursal;
      this.obtenerClientes(); // Llamar obtenerClientes después de obtener el idSucursal
      this.obtenerCitas();
    });
  }

  obtenerClientes() {
    this.clienteService.getClientes().subscribe(clientes => {
      // Filtrar clientes por idSucursal
      this.ListaClientes = clientes.filter(cliente => cliente.id_sucursal === this.idSucursal);
   
    });
  }

  obtenerCitas() {
    this.Citaservice.getreservasEncargados(this.variableGlobal).subscribe(
      (data) => {
       
        this.listaEncargado = data.sucursal.citas;
        this.Sucursal = data.sucursal.nombre;
        this.dataSource = new MatTableDataSource(this.listaEncargado);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyClienteFilter(event: MatSelectChange) {
    const clienteId = event.value;
    this.dataSource.filterPredicate = (data: Cita, filter: string) => {
      return data.id_cliente === parseInt(filter);
    };
    this.dataSource.filter = clienteId.toString();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFechaFilter(event: MatDatepickerInputEvent<Date>) {
    const fecha = event.value;
    this.dataSource.filterPredicate = (data: Cita, filter: string) => {
      const date = new Date(data.fecha_cita);
      return date.toDateString() === new Date(filter).toDateString();
    };
    this.dataSource.filter = fecha.toISOString();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  irDetalleCita(id: number) {
    this.router.navigate(['detalleCita/' + id]);
  }

  agregarEditar(id?: number) {
    const dialogRef = this.dialog.open(AgregarEditarCitaComponent, {
      width: '900px',
      data: { id: this.variableGlobal },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.obtenerCitas();
    });
  }
}
