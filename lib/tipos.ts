export type TipoPublicacion = 'torneo' | 'noticia'

export interface Publicacion {
  id: string
  tipo: TipoPublicacion
  titulo: string
  fecha: string
  sede: string
  resumen: string
  basesUrl: string | null
  imagenUrl: string | null
  creadoEn: string
}

export type NuevaPublicacion = Omit<Publicacion, 'id' | 'creadoEn'>
