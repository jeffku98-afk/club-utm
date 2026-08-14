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

export const SECCIONES_TORNEO = [
  { clave: 'bases', titulo: 'Bases del torneo' },
  { clave: 'inscripcion', titulo: 'Ficha de inscripción' },
  { clave: 'participantes', titulo: 'Lista de participantes' },
  { clave: 'horario', titulo: 'Tabla horaria' },
  { clave: 'sorteos', titulo: 'Sorteo individuales' },
  { clave: 'sorteosDobles', titulo: 'Sorteo dobles' },
  { clave: 'dia1', titulo: 'Resultados día 1' },
  { clave: 'dia2', titulo: 'Resultados día 2' },
  { clave: 'memoria', titulo: 'Memoria final' },
] as const

export type SeccionTorneo = (typeof SECCIONES_TORNEO)[number]['clave']

export type FormatoDocumento = 'pdf' | 'excel'

export interface DocumentoTorneo {
  nombre: string
  url: string
  formato: FormatoDocumento
  actualizadoEn: string
}

export interface Torneo {
  documentos: Partial<Record<SeccionTorneo, DocumentoTorneo>>
  galeriaUrl: string | null
}
