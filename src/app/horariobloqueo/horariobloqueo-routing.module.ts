import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleHorariobloqueoComponent } from './detalle-horariobloqueo/detalle-horariobloqueo.component';

const routes: Routes = [
  {
    path:'detalleHorarioBloqueo/:id',component:DetalleHorariobloqueoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorariobloqueoRoutingModule { }
