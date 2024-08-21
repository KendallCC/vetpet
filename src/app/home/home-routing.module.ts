import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PageNotFoundComponent } from '../share/page-not-found/page-not-found.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';
import { roleGuard } from '../auth/role.guard';

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado', 'cliente'] },
  },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },

  {
    path: 'acerca',
    component: AcercaDeComponent,
    canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado', 'cliente'] },
  },

  { path: '**', component: PageNotFoundComponent },

  { path: 'pagenotfound', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
