import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCitaEncargadosComponent } from './lista-cita-encargados/lista-cita-encargados.component';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';

const routes: Routes = [{
  path:'listaCitasEncargado',component:ListaCitaEncargadosComponent
},
{
  path:'detalleCita/:id',component:DetalleCitaComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitaRoutingModule { }
