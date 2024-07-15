import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';

const routes: Routes = [
  {
    path:'detallServicio/:id',component:DetalleServicioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
