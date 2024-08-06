export type ListaMascota=Mascota[]


export interface Mascota {
    id: number
    nombre: string
    especie: string
    raza: string
    sexo: string
    fecha_nacimiento: string
    id_cliente: number
  }