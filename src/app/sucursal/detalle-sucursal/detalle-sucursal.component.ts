import { Component } from '@angular/core';
import { SucursalService } from '../../share/services/sucursal.service';
import { Sucursal } from '../../share/interfaces/sucursal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-sucursal',
  templateUrl: './detalle-sucursal.component.html',
  styleUrl: './detalle-sucursal.component.css',
})
export class DetalleSucursalComponent {
  sucursal: Sucursal;
  usuarios: any[] = [];
  id: number;
  constructor(
    private serviceSucursal: SucursalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getSucursal();
  }

  getSucursal() {
    this.route.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));
      console.log('el id que llega es:' + this.id);

      if (this.id !== null) {
        this.serviceSucursal.getSucursal(this.id).subscribe((data) => {
          this.sucursal = data;
          this.usuarios = data.usuarios;
        });
      }
    });
  }
}
