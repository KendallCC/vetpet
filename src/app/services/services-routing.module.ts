import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { ListaServiciosClientesComponent } from './lista-servicios-clientes/lista-servicios-clientes.component';

const routes: Routes = [
  {
    path:'listaServicios',component:ListaServiciosClientesComponent
  }
  ,
  {
    path:'detallServicio/:id',component:DetalleServicioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
