import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorariobloqueoRoutingModule } from './horariobloqueo-routing.module';
import { DetalleHorariobloqueoComponent } from './detalle-horariobloqueo/detalle-horariobloqueo.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    DetalleHorariobloqueoComponent
  ],
  imports: [
    CommonModule,
    HorariobloqueoRoutingModule,
    MatCardModule
  ]
})
export class HorariobloqueoModule { }
