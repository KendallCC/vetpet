import { LOCALE_ID,NgModule } from '@angular/core';
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


import localEsCR from '@angular/common/locales/es-CR'
import { registerLocaleData } from '@angular/common';
import { CitaModule } from './cita/cita.module';
registerLocaleData(localEsCR,'es')




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [

    BrowserModule,
    //!Modulos propios creados
    MatCardModule,

    FacturaModule,
    CitaModule,
    CoreModule,
    ShareModule,
    ProductModule,
    HomeModule,
   

    
    //!Rutas de modulos
    AppRoutingModule,
              
         
    
    
  ],
  providers: [
    provideAnimationsAsync(),provideHttpClient(),{provide:LOCALE_ID,useValue: 'es-CR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
