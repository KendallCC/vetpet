import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../share/services/services.service';
import { Servicio } from '../../share/interfaces/servicio';
import { getUTCDateTime } from '../../share/Utils';
@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrl: './detalle-servicio.component.css'
})
export class DetalleServicioComponent {
  Id: number;
  service: Servicio;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private services: ServicesService
  ) {}

  ngOnInit(): void {
    // Observa los cambios en el parámetro de ruta 'id'
    this.route.paramMap.subscribe(params => {
      this.Id = parseInt(params.get('id'), 10);
      console.log('El ID que llega es:' + this.Id);

      if (this.Id !== null) {
        this.services.getService(this.Id).subscribe(data => {
          this.service = data;
        });
      }
    });
  }

  irAAgenda(): void {
    this.router.navigate(['agendacita'], { queryParams: { servicioId: this.Id } });
  }

  getUTCDateTime(dateString: string): string {
    return getUTCDateTime(dateString);
  }
}
