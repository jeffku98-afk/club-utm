import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { crearPublicacion, listarPublicaciones } from '@/lib/almacen'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'
import type { TipoPublicacion } from '@/lib/tipos'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json(await listarPublicaciones())
}

export async function POST(req: NextRequest) {
  if (!(await sesionValida(req.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  }

  const datos = (await req.json()) as Record<string, string | null>
  const titulo = (datos.titulo ?? '').trim()
  const resumen = (datos.resumen ?? '').trim()
  const fecha = datos.fecha ?? ''

  if (!titulo || !resumen || !fecha) {
    return NextResponse.json({ error: 'Faltan el título, la descripción o la fecha.' }, { status: 400 })
  }

  const publicacion = await crearPublicacion({
    tipo: (datos.tipo as TipoPublicacion) ?? 'torneo',
    titulo,
    fecha,
    sede: (datos.sede ?? '').trim(),
    resumen,
    basesUrl: datos.basesUrl?.trim() || null,
    imagenUrl: datos.imagenUrl?.trim() || null,
  })

  revalidatePath('/')
  return NextResponse.json(publicacion, { status: 201 })
}
