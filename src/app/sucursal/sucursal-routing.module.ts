import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleSucursalComponent } from './detalle-sucursal/detalle-sucursal.component';

const routes: Routes = [
  {
    path:'detalleSucursal/:id',
    component:DetalleSucursalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalRoutingModule { }
