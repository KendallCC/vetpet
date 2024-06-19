import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../share/interfaces/cliente';
import { Servicio } from '../../share/interfaces/servicio';
import { Sucursal } from '../../share/interfaces/sucursal';
import { Mascota } from '../../share/interfaces/mascota';
import { ActivatedRoute } from '@angular/router';
import { CitasService } from '../../share/services/citas.service';
import { Cita } from '../../share/interfaces/cita';

@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrl: './detalle-cita.component.css'
})
export class DetalleCitaComponent implements OnInit{
  Id:number
  cliente:Cliente;
  servicio:Servicio
  sucursal:Sucursal
  mascota:Mascota
  cita:Cita
/**
 *
 */
constructor(private route:ActivatedRoute,private service:CitasService) {
  
  
}


  ngOnInit(): void {
    this.obtenerCita();
  }




  obtenerCita(){
    this.route.paramMap.subscribe(params => {
      this.Id = parseInt(params.get('id')); 
      console.log('el id que llega es:'+this.Id);
      
      if (this.Id!==null) {
       this.service.getCita(this.Id).subscribe(data=>{
        this.cita=data
        this.cliente=data.cliente;
        this.servicio=data.servicio
        this.sucursal=data.sucursal
        this.mascota=data.mascota
        console.log(data);
        
        })
      }
    });
  }

}
