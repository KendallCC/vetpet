import { Component } from '@angular/core';
import { GlobalService } from './share/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vetpet';

  idEncargado: number = 2;

 constructor(private globalService:GlobalService){
  this.actualizarVariableGlobal(this.idEncargado)
 }


 actualizarVariableGlobal(numero:Number) {
  this.globalService.setVariableGlobal(numero);
}


}
