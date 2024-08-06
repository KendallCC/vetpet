import { Categoria } from "./categoria";

export type ListaProductos=Producto[];

export interface Producto {
    id?: number
    nombre: string
    descripcion: string
    categoria: Categoria
    precio: number
    Marca: string
    Tipo_mascota: string
}
