import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProdClientesComponent } from './lista-prod-clientes/lista-prod-clientes.component';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { roleGuard } from '../auth/role.guard';

const routes: Routes = [
  {
    path:'productos',component:ListaProdClientesComponent,   canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado','cliente'] }
  },
  {
    path:'productos/:id',component:DetalleProductoComponent,   canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado','cliente'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
