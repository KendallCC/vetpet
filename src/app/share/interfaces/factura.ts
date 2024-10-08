import { Cita } from "./cita";
import { DetalleFactura } from "./detalle-factura";

export type listaFactura=Factura[];

export interface Factura {
  id: number
  id_cita: number
  fecha_factura: string
  subtotal: number
  impuesto: number
  total: number
  metodo_pago: string
  estado: string
  detalle_factura?:DetalleFactura[]
  cita?:Cita
}