//!interfase de la cita segun la tabla de bd
import { Cliente } from "./cliente"
import { Servicio } from "./servicio"
import { Mascota } from "./mascota"
import { Sucursal } from "./sucursal"
import { Producto } from "./product"

export type listaCitas=Cita[]


export interface Cita {
  condicion: string;
  estado: string;
  fecha_cita: string;
  id: number;
  hora_cita: string;
  motivo: string;
  observaciones: string;
  vacunas: string;
  id_cliente: number;
  id_mascota: number;
  id_servicio: number | null;
  id_sucursal: number;
  cliente?: Cliente;
  servicio?: Servicio; // Opcional si no siempre está presente
  sucursal?: Sucursal;
  mascota?: Mascota;
  facturas?: Factura[]; // Incluye la factura
}

export interface Factura {
  id: number;
  id_cita: number;
  fecha_factura: string;
  subtotal: number;
  impuesto: number;
  total: number;
  metodo_pago: string;
  estado: string;
  detalle_factura: DetalleFactura[];
}

export interface DetalleFactura {
  id: number;
  id_factura: number;
  id_producto: number | null;
  id_servicio: number | null;
  cantidad: number;
  precio_unitario: number;
  total_item: number;
  servicio?: Servicio; // Opcional si no siempre está presente
  producto?: any; // Ajusta según sea necesario
}

//!interfase segun la consulta del api para los encargados

export interface Encargadocita {
  sucursal: Sucursalencargado
}

export interface Sucursalencargado {
  id: number
  nombre: string
  citas: Cita[]
}

export enum EstadoCita {
  Pendiente,
  Confirmada,
  Reprogramada,
  Completada,
  Cancelada,
  No_asistio,
}

