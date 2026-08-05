import { randomUUID } from 'node:crypto'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { NuevaPublicacion, Publicacion } from './tipos'

const ARCHIVO_DATOS = path.join(process.cwd(), 'data', 'publicaciones.json')
const CARPETA_BASES = path.join(process.cwd(), 'public', 'bases')

const SEMILLA: Publicacion[] = [
  {
    id: 'open-internacional-copa-utm-2026',
    tipo: 'torneo',
    titulo: 'I Open Internacional Copa UTM 2026',
    fecha: '2026-08-14',
    sede: 'Coliseo del Club Lawn Tennis de la Exposición',
    resumen:
      'Del 14 al 16 de agosto. Categorías oficiales del circuito nacional con puntaje para el ranking, categorías complementarias para no rankeados en individuales y dobles, y categoría paratenis de mesa. Inscripciones ampliadas hasta el viernes 7 de agosto: clubutm@gmail.com / 987647459.',
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
  try {
    return JSON.parse(await readFile(ARCHIVO_DATOS, 'utf8')) as Publicacion[]
  } catch {
    await escribirArchivo(SEMILLA)
    return SEMILLA
  }
}

async function escribirArchivo(publicaciones: Publicacion[]): Promise<void> {
  await mkdir(path.dirname(ARCHIVO_DATOS), { recursive: true })
  await writeFile(ARCHIVO_DATOS, JSON.stringify(publicaciones, null, 2), 'utf8')
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

  if (publicacion.basesUrl?.startsWith('/bases/')) {
    await unlink(path.join(process.cwd(), 'public', publicacion.basesUrl)).catch(() => null)
  }

  await escribirArchivo(publicaciones.filter((p) => p.id !== id))
  return true
}

export async function guardarBases(archivo: File): Promise<string> {
  await mkdir(CARPETA_BASES, { recursive: true })
  const nombre = `${Date.now()}-${archivo.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
  await writeFile(path.join(CARPETA_BASES, nombre), Buffer.from(await archivo.arrayBuffer()))
  return `/bases/${nombre}`
}
