import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesAdministradorComponent } from './reportes-administrador/reportes-administrador.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ReportesAdministradorComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    MatCardModule
  ]
})
export class ReportesModule { }
