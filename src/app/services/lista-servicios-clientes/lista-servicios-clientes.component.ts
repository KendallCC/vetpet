import { Component } from '@angular/core';
import { ServicesService } from '../../share/services/services.service';
import { listaServicios } from '../../share/interfaces/servicio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-servicios-clientes',
  templateUrl: './lista-servicios-clientes.component.html',
  styleUrl: './lista-servicios-clientes.component.css'
})
export class ListaServiciosClientesComponent {

  servicios:listaServicios;
  constructor(private Service:ServicesService, private router:Router) {
  
  }

  ngOnInit(): void {
    this.Service.getServices().subscribe(data => {
      this.servicios = data;
    });
  }


  Detalle(id){
    this.router.navigate([`detallServicio/${id}`])
  }
  

}
