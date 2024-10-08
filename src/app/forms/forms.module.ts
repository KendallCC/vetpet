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
import {MatIconModule} from '@angular/material/icon';
//!formularios reactivos
import { ReactiveFormsModule } from '@angular/forms';
import { ModalAgregarEditarProdComponent } from './productos/modal-agregar-editar-prod/modal-agregar-editar-prod.component';

import { TablaSucursalesComponent } from './Sucursales/tabla-sucursales/tabla-sucursales.component';
import { ModalAgregarEditarSucursalComponent } from './Sucursales/modal-agregar-editar-sucursal/modal-agregar-editar-sucursal.component';
import { TablaBloqueoHorarioComponent } from './horarioBloqueo/tabla-bloqueo-horario/tabla-bloqueo-horario.component';
import { ModalCrearHorarioComponent } from './horarioBloqueo/modal-crear-horario/modal-crear-horario.component';
import { ModalCrearBloqueoComponent } from './horarioBloqueo/modal-crear-bloqueo/modal-crear-bloqueo.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { AgregarEditarCitaComponent } from './cita/agregar-editar-cita/agregar-editar-cita.component';
import { CrearEditarFacturacionComponent } from './facturar/crear-editar-facturacion/crear-editar-facturacion.component';

import { AgregarEditarUsuarioComponent } from './usuario/agregar-editar-usuario/agregar-editar-usuario.component';
import { TablausuariosComponent } from './usuario/tablausuarios/tablausuarios.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { RegistrarUsuarioComponent } from './usuario/registrar-usuario/registrar-usuario.component';
import { UsuarioLoginComponent } from './usuario/usuario-login/usuario-login.component';
import { AgendaCitasComponent } from './cita/agenda-citas/agenda-citas.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AgregarCitaModalComponent } from './cita/agregar-cita-modal/agregar-cita-modal.component';
import { CarritoComponent } from './carrito/carrito.component';
import { NotificacioncitaComponent } from './cita/notificacioncita/notificacioncita.component';
import { MatList, MatListItem } from '@angular/material/list';
MatListItem


@NgModule({
  declarations: [
    TablaProductosComponent,
    TablaServiciosComponent,
    ModalAgregarEditarComponent,
    ModalAgregarEditarProdComponent,
    TablaSucursalesComponent,
    ModalAgregarEditarSucursalComponent,
    TablaBloqueoHorarioComponent,
    ModalCrearHorarioComponent,
    ModalCrearBloqueoComponent,
    AgregarEditarCitaComponent,
    CrearEditarFacturacionComponent,
    TablausuariosComponent,
    AgregarEditarUsuarioComponent,
    RegistrarUsuarioComponent,
    UsuarioLoginComponent,
    AgendaCitasComponent,
    AgregarCitaModalComponent,
    CarritoComponent,
    NotificacioncitaComponent,
   
   

  ],
  imports: [
    CommonModule,
    FullCalendarModule, // Add FullCalendarModule here
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
    MatIconModule,
    ReactiveFormsModule,
    MatGridListModule,
    NgxMaskDirective,  // Agregar directiva de máscara
    NgxMaskPipe,
    MatList,
    MatListItem
  ]
})
export class FormsModule { }
