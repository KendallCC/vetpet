import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProdClientesComponent } from './lista-prod-clientes/lista-prod-clientes.component';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';

const routes: Routes = [
  {
    path:'productos',component:ListaProdClientesComponent
  },
  {
    path:'productos/:id',component:DetalleProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
