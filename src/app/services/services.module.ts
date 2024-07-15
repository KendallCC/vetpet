import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';


@NgModule({
  declarations: [
    DetalleServicioComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule
  ]
})
export class ServicesModule { }
