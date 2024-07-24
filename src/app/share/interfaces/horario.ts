import { Sucursal } from "./sucursal";

export type ListarHorarios=Horario[];

export interface Horario {
    id: number
    id_sucursal: number
    dia_semana: string
    hora_inicio: string
    hora_fin: string
    fecha: string
    bloqueo: boolean
    repeticion: string
    sucursal: Sucursal
}
