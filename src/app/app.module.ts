import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { ProductModule } from './product/product.module';
import { provideHttpClient } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { HomeModule } from './home/home.module';
import { FacturaModule } from './factura/factura.module';
//!configuracion para horas en español

import localEsCR from '@angular/common/locales/es-CR';
import { registerLocaleData } from '@angular/common';
import { CitaModule } from './cita/cita.module';
import { FormsModule } from './forms/forms.module';
import { ServicesModule } from './services/services.module';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
import { SucursalModule } from './sucursal/sucursal.module';
import { HorariobloqueoModule } from './horariobloqueo/horariobloqueo.module';
import { OnlyNumberDirective } from './only-number.directive';

import { DetalleUsuarioComponent } from './usuario/DetalleUsuario/detalle-usuario/detalle-usuario.component';
import { UsuarioModule } from './usuario/usuario.module';

import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';

registerLocaleData(localEsCR, 'es');

// Configuración de máscara
const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  declarations: [AppComponent, OnlyNumberDirective, DetalleUsuarioComponent],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),

    //!Modulos propios creados
    HorariobloqueoModule,
    MatCardModule,
    FormsModule,
    FacturaModule,
    CitaModule,
    CoreModule,
    SucursalModule,
    
    
    ServicesModule, 
    
    ShareModule,
    ProductModule,
    HomeModule,

    //!Rutas de modulos
    AppRoutingModule,
      UsuarioModule,
   
   
  
   
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-CR' },
    provideNativeDateAdapter(),
    provideEnvironmentNgxMask(maskConfig)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
