import type { Publicacion } from './tipos'

export const CLAVE_PUBLICACIONES = ['publicaciones'] as const

export async function obtenerPublicaciones(): Promise<Publicacion[]> {
  const respuesta = await fetch('/api/publicaciones')
  if (!respuesta.ok) throw new Error('No se pudieron cargar las publicaciones.')
  return respuesta.json()
}

export async function publicar(datos: FormData): Promise<Publicacion> {
  const respuesta = await fetch('/api/publicaciones', { method: 'POST', body: datos })
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
