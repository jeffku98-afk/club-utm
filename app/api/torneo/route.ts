import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { guardarDocumentoTorneo, guardarGaleriaTorneo, obtenerTorneo } from '@/lib/almacen'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'
import { SECCIONES_TORNEO, type FormatoDocumento, type SeccionTorneo } from '@/lib/tipos'

export const runtime = 'nodejs'

const TAMANO_MAXIMO = 4 * 1024 * 1024

const FORMATOS: Record<string, FormatoDocumento> = {
  'application/pdf': 'pdf',
  'application/vnd.ms-excel': 'excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
}

const CLAVES = SECCIONES_TORNEO.map((s) => s.clave) as readonly string[]

export async function GET() {
  return NextResponse.json(await obtenerTorneo())
}

export async function POST(req: NextRequest) {
  if (!(await sesionValida(req.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  }

  const formulario = await req.formData()

  if (formulario.has('galeriaUrl')) {
    const galeriaUrl = String(formulario.get('galeriaUrl') ?? '').trim() || null
    const actualizado = await guardarGaleriaTorneo(galeriaUrl)
    revalidatePath('/open-utm')
    return NextResponse.json(actualizado)
  }

  const seccion = String(formulario.get('seccion') ?? '')
  if (!CLAVES.includes(seccion)) {
    return NextResponse.json({ error: 'Sección no reconocida.' }, { status: 400 })
  }

  const archivo = formulario.get('archivo')
  if (!(archivo instanceof File) || archivo.size === 0) {
    return NextResponse.json({ error: 'Adjunta un archivo.' }, { status: 400 })
  }

  const formato = FORMATOS[archivo.type]
  if (!formato) {
    return NextResponse.json({ error: 'El archivo debe ser PDF o Excel.' }, { status: 400 })
  }
  if (archivo.size > TAMANO_MAXIMO) {
    return NextResponse.json({ error: 'El archivo supera los 4 MB.' }, { status: 400 })
  }

  const documento = await guardarDocumentoTorneo(seccion as SeccionTorneo, archivo, formato)
  revalidatePath('/open-utm')
  return NextResponse.json(documento, { status: 201 })
}
