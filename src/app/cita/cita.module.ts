import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitaRoutingModule } from './cita-routing.module';
import { ListaCitaEncargadosComponent } from './lista-cita-encargados/lista-cita-encargados.component';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { DetalleCitaComponent } from './detalle-cita/detalle-cita.component';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar esto
import { ReactiveFormsModule } from '@angular/forms'; // Solo si estás usando formularios reactivos

@NgModule({
  declarations: [ListaCitaEncargadosComponent, DetalleCitaComponent],
  imports: [
    CommonModule,
    CitaRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatTabsModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDatepickerModule,
    MatGridTile,
    MatGridList,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class CitaModule {}
