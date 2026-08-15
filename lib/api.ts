import type { Publicacion, Torneo } from './tipos'

export const CLAVE_PUBLICACIONES = ['publicaciones'] as const

export async function obtenerPublicaciones(): Promise<Publicacion[]> {
  const respuesta = await fetch('/api/publicaciones')
  if (!respuesta.ok) throw new Error('No se pudieron cargar las publicaciones.')
  return respuesta.json()
}

export async function publicar(datos: Record<string, string | null>): Promise<Publicacion> {
  const respuesta = await fetch('/api/publicaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (!respuesta.ok) throw new Error((await respuesta.json()).error ?? 'No se pudo publicar.')
  return respuesta.json()
}

export async function eliminar(id: string): Promise<void> {
  const respuesta = await fetch(`/api/publicaciones/${id}`, { method: 'DELETE' })
  if (!respuesta.ok) throw new Error((await respuesta.json()).error ?? 'No se pudo eliminar.')
}

export function fechaLarga(iso: string): string {
  if (!iso) return 'Fecha por confirmar'
  const [anio, mes, dia] = iso.split('-').map(Number)
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const CLAVE_TORNEO = ['torneo'] as const

export async function obtenerTorneoCliente(): Promise<Torneo> {
  const respuesta = await fetch('/api/torneo')
  if (!respuesta.ok) throw new Error('No se pudo cargar la información del torneo.')
  return respuesta.json()
}

export async function guardarTorneo(datos: Record<string, unknown>): Promise<unknown> {
  const respuesta = await fetch('/api/torneo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (!respuesta.ok) throw new Error((await respuesta.json()).error ?? 'No se pudo guardar.')
  return respuesta.json()
}

export async function eliminarDocumentoTorneoCliente(seccion: string): Promise<void> {
  const respuesta = await fetch(`/api/torneo/${seccion}`, { method: 'DELETE' })
  if (!respuesta.ok) throw new Error((await respuesta.json()).error ?? 'No se pudo eliminar.')
}

export const TAMANO_MAXIMO_ARCHIVO = 20 * 1024 * 1024

/** Sube el archivo directamente a Vercel Blob y devuelve su URL pública. */
export async function subirArchivo(archivo: File, carpeta: string): Promise<string> {
  const { upload } = await import('@vercel/blob/client')

  const resultado = await upload(`${carpeta}/${archivo.name}`, archivo, {
    access: 'public',
    handleUploadUrl: '/api/subida',
    contentType: archivo.type,
  })

  return resultado.url
}
