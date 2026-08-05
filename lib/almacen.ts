import { del, list, put } from '@vercel/blob'
import { randomUUID } from 'node:crypto'
import type { NuevaPublicacion, Publicacion } from './tipos'

const RUTA_DATOS = 'datos/publicaciones.json'
const PREFIJO_BASES = 'bases/'

const SEMILLA: Publicacion[] = [
  {
    id: 'open-internacional-copa-utm-2026',
    tipo: 'torneo',
    titulo: 'I Open Internacional Copa UTM 2026',
    fecha: '2026-08-14',
    sede: 'Coliseo del Club Lawn Tennis de la Exposición',
    resumen:
      'Del 14 al 16 de agosto. Categorías oficiales del circuito nacional con puntaje para el ranking, categorías complementarias para no rankeados en individuales y dobles, y categoría paratenis de mesa. Informes e inscripciones: clubutm@gmail.com / 987647459.',
    basesUrl: null,
    imagenUrl: '/open-internacional-copa-utm-2026.jpeg',
    creadoEn: '2026-07-20T12:00:00.000Z',
  },
  {
    id: 'campeones-juan-xxiii',
    tipo: 'noticia',
    titulo: 'El club campeonó en el Open Juan XXIII',
    fecha: '2026-07-12',
    sede: 'Colegio Juan XXIII',
    resumen:
      'Nuestros deportistas subieron al podio en el 34° Open Internacional de Tenis de Mesa Juan XXIII, en individuales, dobles y paratenis de mesa. Formamos equipos, creamos campeones.',
    basesUrl: null,
    imagenUrl: '/equipo-juan-xxiii.png',
    creadoEn: '2026-07-12T12:00:00.000Z',
  },
]

async function leerArchivo(): Promise<Publicacion[]> {
  const { blobs } = await list({ prefix: RUTA_DATOS, limit: 1 })
  if (blobs.length === 0) {
    await escribirArchivo(SEMILLA)
    return SEMILLA
  }

  const respuesta = await fetch(blobs[0].url, { cache: 'no-store' })
  if (!respuesta.ok) throw new Error('No se pudo leer el archivo de publicaciones.')
  return (await respuesta.json()) as Publicacion[]
}

async function escribirArchivo(publicaciones: Publicacion[]): Promise<void> {
  await put(RUTA_DATOS, JSON.stringify(publicaciones, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  })
}

export async function listarPublicaciones(): Promise<Publicacion[]> {
  const publicaciones = await leerArchivo()
  return publicaciones.sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export async function crearPublicacion(datos: NuevaPublicacion): Promise<Publicacion> {
  const publicaciones = await leerArchivo()
  const publicacion: Publicacion = { ...datos, id: randomUUID(), creadoEn: new Date().toISOString() }
  await escribirArchivo([publicacion, ...publicaciones])
  return publicacion
}

export async function eliminarPublicacion(id: string): Promise<boolean> {
  const publicaciones = await leerArchivo()
  const publicacion = publicaciones.find((p) => p.id === id)
  if (!publicacion) return false

  if (publicacion.basesUrl?.includes(PREFIJO_BASES)) {
    await del(publicacion.basesUrl).catch(() => null)
  }

  await escribirArchivo(publicaciones.filter((p) => p.id !== id))
  return true
}

export async function guardarBases(archivo: File): Promise<string> {
  const nombre = archivo.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const { url } = await put(`${PREFIJO_BASES}${Date.now()}-${nombre}`, archivo, {
    access: 'public',
    contentType: 'application/pdf',
  })
  return url
}
