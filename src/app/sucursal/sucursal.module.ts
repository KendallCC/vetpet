import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalRoutingModule } from './sucursal-routing.module';
import { DetalleSucursalComponent } from './detalle-sucursal/detalle-sucursal.component';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    DetalleSucursalComponent
  ],
  imports: [
    CommonModule,
    SucursalRoutingModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatGridListModule,
    MatDividerModule
  ]
})
export class SucursalModule { }
