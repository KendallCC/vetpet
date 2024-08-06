import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { ListaServiciosClientesComponent } from './lista-servicios-clientes/lista-servicios-clientes.component';


@NgModule({
  declarations: [
    DetalleServicioComponent,
    ListaServiciosClientesComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule
  ]
})
export class ServicesModule { }
