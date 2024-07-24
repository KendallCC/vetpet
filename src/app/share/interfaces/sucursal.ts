import { listaClientes } from "./cliente";

export type ListaSucursales=Sucursal[];

export interface Sucursal {
    id?: number
    nombre: string
    descripcion: string
    telefono: string
    direccion: string
    correo_electronico: string
    usuarios?: listaClientes[];
  }
  