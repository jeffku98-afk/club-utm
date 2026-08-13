import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { guardarDocumentoTorneo, guardarGaleriaTorneo, obtenerTorneo } from '@/lib/almacen'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'
import { SECCIONES_TORNEO, type FormatoDocumento, type SeccionTorneo } from '@/lib/tipos'

export const runtime = 'nodejs'

const CLAVES = SECCIONES_TORNEO.map((s) => s.clave) as readonly string[]

export async function GET() {
  return NextResponse.json(await obtenerTorneo())
}

export async function POST(req: NextRequest) {
  if (!(await sesionValida(req.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  }

  const datos = (await req.json()) as {
    galeriaUrl?: string | null
    seccion?: string
    nombre?: string
    url?: string
    formato?: FormatoDocumento
  }

  if ('galeriaUrl' in datos) {
    const actualizado = await guardarGaleriaTorneo(datos.galeriaUrl?.trim() || null)
    revalidatePath('/open-utm')
    return NextResponse.json(actualizado)
  }

  if (!datos.seccion || !CLAVES.includes(datos.seccion)) {
    return NextResponse.json({ error: 'Sección no reconocida.' }, { status: 400 })
  }
  if (!datos.url || !datos.nombre || !datos.formato) {
    return NextResponse.json({ error: 'Faltan datos del archivo.' }, { status: 400 })
  }

  const documento = await guardarDocumentoTorneo(
    datos.seccion as SeccionTorneo,
    datos.nombre,
    datos.url,
    datos.formato,
  )

  revalidatePath('/open-utm')
  return NextResponse.json(documento, { status: 201 })
}
