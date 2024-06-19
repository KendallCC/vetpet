import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaFacturasComponent } from './lista-facturas/lista-facturas.component';
import { DetalleFacturaComponent } from './detalle-factura/detalle-factura.component';

const routes: Routes = [
  {
    path:'factura',component:ListaFacturasComponent
  },
  {
    path:'detallefactura/:id',component:DetalleFacturaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaRoutingModule { }
