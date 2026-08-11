import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { crearPublicacion, guardarBases, guardarPortada, listarPublicaciones } from '@/lib/almacen'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'
import type { TipoPublicacion } from '@/lib/tipos'

export const runtime = 'nodejs'

const TAMANO_MAXIMO_PDF = 4 * 1024 * 1024
const TAMANO_MAXIMO_IMAGEN = 2 * 1024 * 1024
const FORMATOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp']

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
    if (bases.size > TAMANO_MAXIMO_PDF) {
      return NextResponse.json({ error: 'El PDF supera los 4 MB.' }, { status: 400 })
    }
    basesUrl = await guardarBases(bases)
  }

  const portada = formulario.get('portada')
  let imagenUrl: string | null = String(formulario.get('imagenUrl') ?? '').trim() || null

  if (portada instanceof File && portada.size > 0) {
    if (!FORMATOS_IMAGEN.includes(portada.type)) {
      return NextResponse.json({ error: 'La portada debe ser JPG, PNG o WebP.' }, { status: 400 })
    }
    if (portada.size > TAMANO_MAXIMO_IMAGEN) {
      return NextResponse.json({ error: 'La portada supera los 2 MB.' }, { status: 400 })
    }
    imagenUrl = await guardarPortada(portada)
  }

  const publicacion = await crearPublicacion({
    tipo: (formulario.get('tipo') as TipoPublicacion) ?? 'torneo',
    titulo,
    fecha,
    sede: String(formulario.get('sede') ?? '').trim(),
    resumen,
    basesUrl,
    imagenUrl,
  })

  revalidatePath('/')
  return NextResponse.json(publicacion, { status: 201 })
}
