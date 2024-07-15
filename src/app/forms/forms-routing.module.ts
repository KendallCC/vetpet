import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaServiciosComponent } from './Servicios/tabla-servicios/tabla-servicios.component';

const routes: Routes = [
  {
    path:'tablaServicios',component:TablaServiciosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
