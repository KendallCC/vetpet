export type listaServicios=Servicio[]

export interface Servicio {
    id?: number
    nombre: string
    descripcion: string
    tarifa: number
    tiempo_servicio: string
    Tipo_mascota: string
    Especialidad: string
  }