import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../../share/services/services.service';
import { Servicio } from '../../share/interfaces/servicio';
import { getUTCDateTime } from '../../share/Utils';
@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrl: './detalle-servicio.component.css'
})
export class DetalleServicioComponent {
  Id: number
  service: Servicio
  constructor(private route: ActivatedRoute, private services: ServicesService) {

  }


  ngOnInit(): void {
    // Observa los cambios en el parámetro de ruta 'id'
    this.route.paramMap.subscribe(params => {
      this.Id = parseInt(params.get('id'));
      console.log('el id que llega es:' + this.Id);

      if (this.Id !== null) {
        this.services.getService(this.Id).subscribe(data => {
          this.service = data;
        });
      }
    })
  }



  getUTCDateTime(dateString: string): string {
    return getUTCDateTime(dateString);
  }

}
