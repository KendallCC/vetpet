import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,MatToolbarModule,MatIconModule,MatMenuModule,MatDivider
  ],
  exports: [
    HeaderComponent,
    FooterComponent,MatDivider
  ]
})
export class CoreModule { }
