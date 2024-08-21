import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesAdministradorComponent } from './reportes-administrador/reportes-administrador.component';
import { roleGuard } from '../auth/role.guard';

const routes: Routes = [
  {
    path:'reportes',component:ReportesAdministradorComponent,   canActivate: [roleGuard],
    data: { roles: ['administrador'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
