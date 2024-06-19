import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListaProdClientesComponent } from './lista-prod-clientes/lista-prod-clientes.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';



@NgModule({
  declarations: [
    ListaProdClientesComponent,
    DetalleProductoComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,MatGridList,MatGridTile,MatCardModule
  ]
})
export class ProductModule { }
