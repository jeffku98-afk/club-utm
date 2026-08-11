import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { eliminarDocumentoTorneo } from '@/lib/almacen'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'
import { SECCIONES_TORNEO, type SeccionTorneo } from '@/lib/tipos'

export const runtime = 'nodejs'

const CLAVES = SECCIONES_TORNEO.map((s) => s.clave) as readonly string[]

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ seccion: string }> }) {
  if (!(await sesionValida(req.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  }

  const { seccion } = await params
  if (!CLAVES.includes(seccion)) {
    return NextResponse.json({ error: 'Sección no reconocida.' }, { status: 400 })
  }

  const eliminado = await eliminarDocumentoTorneo(seccion as SeccionTorneo)
  if (!eliminado) return NextResponse.json({ error: 'No hay documento cargado.' }, { status: 404 })

  revalidatePath('/open-utm')
  return NextResponse.json({ ok: true })
}
