//!interfase de la cita segun la tabla de bd
import { Cliente } from "./cliente"
import { Servicio } from "./servicio"
import { Mascota } from "./mascota"
import { Sucursal } from "./sucursal"

export type listaCitas=Cita[]


export interface Cita {
  condicion: string
  estado: string
  fecha_cita: string
  id: number
  hora_cita: string
  motivo: string
  observaciones: string
  vacunas: string
  cliente: Cliente
  servicio: Servicio
  sucursal: Sucursal
  mascota: Mascota
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

