import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PageNotFoundComponent } from '../share/page-not-found/page-not-found.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },

  { path: 'acerca', component: AcercaDeComponent },


  { path: '**', component: PageNotFoundComponent },

  { path: 'pagenotfound', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
