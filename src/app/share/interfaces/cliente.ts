export type listaClientes=Cliente[]

export interface Cliente {
    id: number
    nombre: string
    telefono: string
    correo_electronico: string
    direccion: string
    fecha_nacimiento: string
    contrasena: string
    rol: string
    id_sucursal: number
  }