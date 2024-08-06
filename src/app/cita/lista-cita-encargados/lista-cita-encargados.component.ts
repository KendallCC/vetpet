import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { CitasService } from '../../share/services/citas.service';
import { Cita, Encargadocita } from '../../share/interfaces/cita';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../share/services/global.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AgregarEditarCitaComponent } from '../../forms/cita/agregar-editar-cita/agregar-editar-cita.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../share/services/usuario.service';
import { listaClientes } from '../../share/interfaces/cliente';

@Component({
  selector: 'app-lista-cita-encargados',
  templateUrl: './lista-cita-encargados.component.html',
  styleUrl: './lista-cita-encargados.component.css',
})
export class ListaCitaEncargadosComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = ['id', 'fecha_cita', 'hora_cita', 'estado','opciones'];
  dataSource: MatTableDataSource<Cita>;
  listaEncargado: Cita[] ;
  ListaClientes:listaClientes;
  variableGlobal: number;
  private subscription: Subscription;

  Sucursal:string="";
  
  constructor(
    private Citaservice: CitasService,
    private clienteService: UsuarioService,
    private globalService: GlobalService,
    private router: Router,
    public dialog: MatDialog
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
  }

  suscripcionVariableGlobal() {
    this.subscription = this.globalService.IdEncargado$.subscribe((value) => {
      this.variableGlobal = value;
      console.log('Valor de variableGlobal actualizado:', this.variableGlobal);
    });
  }


obtenerClientes(){
  this.clienteService.getClientes().subscribe(clientes=>{
    this.ListaClientes=clientes
  })
}
  
  obtenerCitas() {
    this.Citaservice.getreservasEncargados(this.variableGlobal).subscribe(
      (data) => {
        console.log('Data del metodo getreservasEncargados',data);
        
        this.listaEncargado = data.sucursal.citas;
        this.Sucursal=data.sucursal.nombre
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


irDetalleCita(id:number){
    this.router.navigate(['detalleCita/'+id])
  
}

agregarEditar(id?:number){
  

  const dialogRef = this.dialog.open(AgregarEditarCitaComponent, {
    width: '800px',
    data: {id:this.variableGlobal}, 
    disableClose:true
  });

  dialogRef.afterClosed().subscribe(result => {
    this.obtenerCitas();
  });

}





}
