import { Component, OnInit } from '@angular/core';
import { Horario } from '../../share/interfaces/horario';
import { ActivatedRoute } from '@angular/router';
import { HorariobloqueoService } from '../../share/services/horariobloqueo.service';

@Component({
  selector: 'app-detalle-horariobloqueo',
  templateUrl: './detalle-horariobloqueo.component.html',
  styleUrl: './detalle-horariobloqueo.component.css'
})
export class DetalleHorariobloqueoComponent implements OnInit{
  Id:number
  horario: Horario;

constructor(private route:ActivatedRoute,private service:HorariobloqueoService){

}


ngOnInit(): void {
  // Observa los cambios en el parámetro de ruta 'id'
  this.route.paramMap.subscribe(params => {
    this.Id = parseInt(params.get('id')); 
    console.log('el id que llega es:'+this.Id);
    
    if (this.Id!==null) {
     this.service.getDetalleHorario(this.Id).subscribe(data=>{
      this.horario=data;
      })
    }
  });
}


}
