import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../share/services/usuario.service';
import { Cliente, listaClientes } from '../../../share/interfaces/cliente';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { GlobalService } from '../../../share/services/global.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AgregarEditarUsuarioComponent } from '../agregar-editar-usuario/agregar-editar-usuario.component';

@Component({
  selector: 'app-tablausuarios',
  templateUrl: './tablausuarios.component.html',
  styleUrls: ['./tablausuarios.component.css']
})
export class TablausuariosComponent implements OnInit , AfterViewInit{
  displayedColumns: string[] = ['id', 'nombre', 'telefono', 'correo_electronico', 'direccion', 'fecha_nacimiento', 'rol', 'id_sucursal', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  private subscription: Subscription;
  variableGlobal: number;
  idSucursal: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarios: UsuarioService,
    private globalService: GlobalService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.suscripcionVariableGlobal();
    this.obtenerEncargado();
    this.getUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  suscripcionVariableGlobal() {
    this.subscription = this.globalService.IdEncargado$.subscribe((value) => {
      this.variableGlobal = value;
      console.log('Valor de variableGlobal actualizado:', this.variableGlobal);
    });
  }

  obtenerEncargado() {
    this.usuarios.getCliente(this.variableGlobal).subscribe(encargado => {
      this.idSucursal = encargado.id_sucursal;
      this.getUsuarios();
    });
  }

  getUsuarios(): void {
    this.usuarios.getClientes().subscribe((clientes) => {
      this.dataSource.data = clientes;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregarEditarUsuario(id?: number): void {
    const dialogRef = this.dialog.open(AgregarEditarUsuarioComponent, {
      width: '520px',
      data: { id },
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsuarios(); // Recargar la lista de usuarios si se actualiza o agrega un usuario
      }
    });
  }


}
