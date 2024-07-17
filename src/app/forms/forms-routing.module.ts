import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaServiciosComponent } from './Servicios/tabla-servicios/tabla-servicios.component';
import { TablaProductosComponent } from './productos/tabla-productos/tabla-productos.component';

const routes: Routes = [
  {
    path:'tablaServicios',component:TablaServiciosComponent,
  },
  {
    path:'tablaProductos',component:TablaProductosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
