import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaFacturasComponent } from './lista-facturas/lista-facturas.component';
import { DetalleFacturaComponent } from './detalle-factura/detalle-factura.component';
import { roleGuard } from '../auth/role.guard';
import { FacturasusuarioComponent } from './facturasusuario/facturasusuario.component';

const routes: Routes = [
  {
    path:'factura',component:ListaFacturasComponent,
    canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado'] }
  },
  {
    path:'detallefactura/:id',component:DetalleFacturaComponent,
    canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado','cliente'] }
  },
  {
    path:'Clientefacturas',component:FacturasusuarioComponent,
    canActivate: [roleGuard],
    data: { roles: ['administrador', 'encargado','cliente'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaRoutingModule { }
