import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCitaEncargadosComponent } from './lista-cita-encargados/lista-cita-encargados.component';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';
import { AgregarEditarCitaComponent } from '../forms/cita/agregar-editar-cita/agregar-editar-cita.component';
import { roleGuard } from '../auth/role.guard';

const routes: Routes = [{
  path: 'listaCitasEncargado',
  component: ListaCitaEncargadosComponent,
  canActivate: [roleGuard],
  data: { roles: ['administrador', 'encargado'] }
},
{
  path: 'detalleCita/:id', component: DetalleCitaComponent
},
{
  path: 'agregarCita',
  component: AgregarEditarCitaComponent,
  canActivate: [roleGuard],
  data: { roles: ['administrador', 'encargado'] }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitaRoutingModule { }
