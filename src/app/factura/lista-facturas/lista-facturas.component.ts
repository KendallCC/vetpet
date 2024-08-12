import { Component, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaService } from '../../share/services/factura.service';
import { Factura, listaFactura } from '../../share/interfaces/factura';
import { Router } from '@angular/router';
import { CrearEditarFacturacionComponent } from '../../forms/facturar/crear-editar-facturacion/crear-editar-facturacion.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../share/services/usuario.service';
import { GlobalService } from '../../share/services/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html',
  styleUrls: ['./lista-facturas.component.css'],
})
export class ListaFacturasComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'fecha_factura', 'total', 'estado', 'opciones'];
  dataSource: MatTableDataSource<Factura>;
  clientes: any[] = [];
  selectedCliente: number | null = null;
  selectedDate: Date | null = null;

  variableGlobal: number;
  private subscription: Subscription;
  idSucursal: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public ListFactura: listaFactura = [];

  constructor(
    private service: FacturaService,
    private usuarioService: UsuarioService,
    private globalService: GlobalService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.ListFactura);
  }

  ngAfterViewInit(): void {
    // Suscribe a cambios en una variable global (ID del encargado) después de que la vista se ha inicializado.
    this.suscripcionVariableGlobal();
  }

  ngOnDestroy(): void {
    // Cancela la suscripción a la variable global cuando se destruye el componente para evitar pérdidas de memoria.
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadClientes(id_sucursal: number) {
    // Carga la lista de clientes filtrados por el ID de la sucursal.
    this.usuarioService.getClientes().subscribe((clientes) => {
      this.clientes = clientes.filter(e => e.id_sucursal === id_sucursal);
    });
  }

  suscripcionVariableGlobal() {
    // Se suscribe a la variable global que contiene el ID del encargado y carga los clientes y facturas relacionados.
    this.subscription = this.globalService.IdEncargado$.subscribe((value) => {
      this.variableGlobal = value;
      if (this.variableGlobal) {
        this.obtenerEncargado();
      }
    });
  }

  obtenerEncargado() {
    // Obtiene la información del encargado usando el ID almacenado en la variable global.
    if (this.variableGlobal) {
      this.usuarioService.getCliente(this.variableGlobal).subscribe(encargado => {
        this.idSucursal = encargado.id_sucursal;
        this.loadClientes(encargado.id_sucursal);
        this.getFacturas();
      });
    }
  }

  getFacturas() {
    // Obtiene la lista de facturas desde el servicio y las carga en la tabla.
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
    // Aplica un filtro básico basado en texto para filtrar las facturas en la tabla.
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyAdvancedFilter() {
    // Aplica un filtro avanzado que permite filtrar las facturas por cliente y fecha.
    this.dataSource.filterPredicate = (data: Factura, filter: string) => {
      const clienteMatch = !this.selectedCliente || data.cita.cliente.id === this.selectedCliente;
      const dateMatch = !this.selectedDate || new Date(data.fecha_factura).toDateString() === new Date(this.selectedDate).toDateString();
      return clienteMatch && dateMatch;
    };

    this.dataSource.filter = '' + Math.random(); // Refresca el filtro

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    // Limpia los filtros aplicados (cliente y fecha) y recarga la lista de facturas.
    this.selectedCliente = null;
    this.selectedDate = null;
    this.getFacturas();
  }

  irDetalle(id: number) {
    // Navega a la página de detalles de una factura específica.
    this.router.navigate([`detallefactura/${id}`]);
  }

  agregarEditar(id?: number) {
    // Abre un diálogo para agregar o editar una factura.
    const dialogRef = this.dialog.open(CrearEditarFacturacionComponent, {
      width: '800px',
      disableClose: true,
      data: { idFactura: id },
    });

    dialogRef.afterClosed().subscribe(() => {
      // Recarga la lista de facturas después de cerrar el diálogo.
      this.getFacturas();
    });
  }
}
