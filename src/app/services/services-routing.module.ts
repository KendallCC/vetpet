import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { ListaServiciosClientesComponent } from './lista-servicios-clientes/lista-servicios-clientes.component';
import { roleGuard } from '../auth/role.guard';

const routes: Routes = [
  {
    path:'listaServicios',component:ListaServiciosClientesComponent,   canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado','cliente'] }
  }
  ,
  {
    path:'detallServicio/:id',component:DetalleServicioComponent,   canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado','cliente'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
