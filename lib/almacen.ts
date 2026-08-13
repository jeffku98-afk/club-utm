import { del, list, put } from '@vercel/blob'
import { randomUUID } from 'node:crypto'
import type {
  DocumentoTorneo,
  FormatoDocumento,
  NuevaPublicacion,
  Publicacion,
  SeccionTorneo,
  Torneo,
} from './tipos'

const RUTA_DATOS = 'datos/publicaciones.json'


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

/**
 * URL pública del store. Se deriva del token (vercel_blob_rw_<storeId>_<secreto>)
 * para leer los índices por URL directa, sin gastar operaciones avanzadas de Blob.
 */
function baseDelStore(): string | null {
  const explicita = process.env.BLOB_BASE_URL
  if (explicita) return explicita.replace(/\/$/, '')

  const partes = process.env.BLOB_READ_WRITE_TOKEN?.split('_')
  if (!partes || partes.length < 5) return null
  return `https://${partes[3]}.public.blob.vercel-storage.com`
}

async function leerJson<T>(ruta: string, respaldo: T): Promise<T> {
  const base = baseDelStore()

  if (base) {
    const respuesta = await fetch(`${base}/${ruta}`, { cache: 'no-store' })
    if (respuesta.ok) return (await respuesta.json()) as T
    if (respuesta.status === 404) return respaldo
  }

  // Respaldo: si la URL directa no funciona, se resuelve con una operación avanzada.
  const { blobs } = await list({ prefix: ruta, limit: 1 })
  if (blobs.length === 0) return respaldo

  const respuesta = await fetch(blobs[0].url, { cache: 'no-store' })
  if (!respuesta.ok) return respaldo
  return (await respuesta.json()) as T
}

async function leerArchivo(): Promise<Publicacion[]> {
  return leerJson<Publicacion[]>(RUTA_DATOS, SEMILLA)
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
  try {
    const publicaciones = await leerArchivo()
    return [...publicaciones].sort((a, b) => b.fecha.localeCompare(a.fecha))
  } catch (error) {
    console.error('Almacén no disponible, se muestran las publicaciones base:', error)
    return SEMILLA
  }
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

  await Promise.all([
    eliminarArchivo(publicacion.basesUrl),
    eliminarArchivo(publicacion.imagenUrl),
  ])

  await escribirArchivo(publicaciones.filter((p) => p.id !== id))
  return true
}

/** Elimina un blob del store si la URL le pertenece. */
export async function eliminarArchivo(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith('https://')) return
  await del(url).catch(() => null)
}

const RUTA_TORNEO = 'datos/open-utm.json'

const TORNEO_VACIO: Torneo = { documentos: {}, galeriaUrl: null }

export async function obtenerTorneo(): Promise<Torneo> {
  try {
    return await leerJson<Torneo>(RUTA_TORNEO, TORNEO_VACIO)
  } catch {
    return TORNEO_VACIO
  }
}

async function escribirTorneo(torneo: Torneo): Promise<void> {
  await put(RUTA_TORNEO, JSON.stringify(torneo, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  })
}

export async function guardarDocumentoTorneo(
  seccion: SeccionTorneo,
  nombre: string,
  url: string,
  formato: FormatoDocumento,
): Promise<DocumentoTorneo> {
  const torneo = await obtenerTorneo()
  const anterior = torneo.documentos[seccion]

  const documento: DocumentoTorneo = {
    nombre,
    url,
    formato,
    actualizadoEn: new Date().toISOString(),
  }

  await escribirTorneo({ ...torneo, documentos: { ...torneo.documentos, [seccion]: documento } })
  await eliminarArchivo(anterior?.url)

  return documento
}

export async function eliminarDocumentoTorneo(seccion: SeccionTorneo): Promise<boolean> {
  const torneo = await obtenerTorneo()
  const documento = torneo.documentos[seccion]
  if (!documento) return false

  const documentos = { ...torneo.documentos }
  delete documentos[seccion]

  await escribirTorneo({ ...torneo, documentos })
  await eliminarArchivo(documento.url)
  return true
}

export async function guardarGaleriaTorneo(galeriaUrl: string | null): Promise<Torneo> {
  const torneo = await obtenerTorneo()
  const actualizado = { ...torneo, galeriaUrl }
  await escribirTorneo(actualizado)
  return actualizado
}
