import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaServiciosComponent } from './Servicios/tabla-servicios/tabla-servicios.component';
import { TablaProductosComponent } from './productos/tabla-productos/tabla-productos.component';
import { TablaSucursalesComponent } from './Sucursales/tabla-sucursales/tabla-sucursales.component';
import { TablaBloqueoHorarioComponent } from './horarioBloqueo/tabla-bloqueo-horario/tabla-bloqueo-horario.component';


const routes: Routes = [
  
  {
    path:'tablaServicios',component:TablaServiciosComponent,
  },
  {
    path:'tablaProductos',component:TablaProductosComponent
  },
  {
    path:'tablaSucursales',component:TablaSucursalesComponent
  },
  {
    path:'tablabBloqueoHorario',component:TablaBloqueoHorarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
