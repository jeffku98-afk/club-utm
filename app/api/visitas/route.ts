import { NextRequest, NextResponse } from 'next/server'
import { obtenerResumenVisitas, registrarVisita } from '@/lib/contador'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Registra una visita. Público, pero no devuelve ningún dato. */
export async function POST(req: NextRequest) {
  // No cuenta al administrador con sesión abierta.
  if (await sesionValida(req.cookies.get(COOKIE_SESION)?.value)) {
    return new NextResponse(null, { status: 204 })
  }

  await registrarVisita()
  return new NextResponse(null, { status: 204 })
}

/** Devuelve el resumen. Solo para el administrador. */
export async function GET(req: NextRequest) {
  if (!(await sesionValida(req.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  }

  return NextResponse.json(await obtenerResumenVisitas())
}
