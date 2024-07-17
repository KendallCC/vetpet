import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsRoutingModule } from './forms-routing.module';
import { TablaProductosComponent } from './productos/tabla-productos/tabla-productos.component';


//!importaciones angular
import {MatTableModule} from '@angular/material/table';
import { TablaServiciosComponent } from './Servicios/tabla-servicios/tabla-servicios.component';


import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ModalAgregarEditarComponent } from './Servicios/modal-agregar-editar/modal-agregar-editar.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
//!formularios reactivos
import { ReactiveFormsModule } from '@angular/forms';
import { ModalAgregarEditarProdComponent } from './productos/modal-agregar-editar-prod/modal-agregar-editar-prod.component';

@NgModule({
  declarations: [
    TablaProductosComponent,
    TablaServiciosComponent,
    ModalAgregarEditarComponent,
    ModalAgregarEditarProdComponent,

  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ]
})
export class FormsModule { }
