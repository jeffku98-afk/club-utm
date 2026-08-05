import { NextRequest, NextResponse } from 'next/server'
import { crearPublicacion, guardarBases, listarPublicaciones } from '@/lib/almacen'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'
import type { TipoPublicacion } from '@/lib/tipos'

export const runtime = 'nodejs'

const TAMANO_MAXIMO = 4 * 1024 * 1024

export async function GET() {
  return NextResponse.json(await listarPublicaciones())
}

export async function POST(req: NextRequest) {
  if (!(await sesionValida(req.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  }

  const formulario = await req.formData()
  const titulo = String(formulario.get('titulo') ?? '').trim()
  const resumen = String(formulario.get('resumen') ?? '').trim()
  const fecha = String(formulario.get('fecha') ?? '')

  if (!titulo || !resumen || !fecha) {
    return NextResponse.json({ error: 'Faltan el título, la descripción o la fecha.' }, { status: 400 })
  }

  const bases = formulario.get('bases')
  let basesUrl: string | null = String(formulario.get('enlaceBases') ?? '').trim() || null

  if (bases instanceof File && bases.size > 0) {
    if (bases.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Las bases deben estar en formato PDF.' }, { status: 400 })
    }
    if (bases.size > TAMANO_MAXIMO) {
      return NextResponse.json({ error: 'El PDF supera los 4 MB.' }, { status: 400 })
    }
    basesUrl = await guardarBases(bases)
  }

  const publicacion = await crearPublicacion({
    tipo: (formulario.get('tipo') as TipoPublicacion) ?? 'torneo',
    titulo,
    fecha,
    sede: String(formulario.get('sede') ?? '').trim(),
    resumen,
    basesUrl,
    imagenUrl: String(formulario.get('imagenUrl') ?? '').trim() || null,
  })

  return NextResponse.json(publicacion, { status: 201 })
}
