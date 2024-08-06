import { Cliente } from "./cliente";
import { Producto } from "./product"
import { Servicio } from "./servicio"
import { Sucursal } from "./sucursal";
export type DetallesFactura=DetalleFactura[];

export interface DetalleFactura {
    id: number
    id_factura: number
    id_producto: number
    id_servicio: any
    cantidad: number
    precio_unitario: number
    total_item: number
    producto: Producto
    servicio: Servicio
    factura: Factura
  }
  

  
  export interface Factura {
    cita: Cita
    fecha_factura:Date
  }
  
  export interface Cita {
    sucursal: Sucursal
    cliente:Cliente
  }
  
