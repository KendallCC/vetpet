import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturaRoutingModule } from './factura-routing.module';
import { ListaFacturasComponent } from './lista-facturas/lista-facturas.component';


import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { DetalleFacturaComponent } from './detalle-factura/detalle-factura.component';
import { MatToolbar } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    ListaFacturasComponent,
    DetalleFacturaComponent
  ],
  imports: [
    CommonModule,
    FacturaRoutingModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,MatCardModule,MatListModule,MatToolbar
  ]
})
export class FacturaModule { }
