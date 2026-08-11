import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Verifica si los índices se pueden leer por URL directa (operación simple)
 * o si el código está cayendo al respaldo con list() (operación avanzada).
 */
export async function GET(req: NextRequest) {
  if (!(await sesionValida(req.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  }

  const explicita = process.env.BLOB_BASE_URL?.replace(/\/$/, '') ?? null
  const partes = process.env.BLOB_READ_WRITE_TOKEN?.split('_')
  const derivada = partes && partes.length >= 5
    ? `https://${partes[3]}.public.blob.vercel-storage.com`
    : null
  const base = explicita ?? derivada

  const rutas = ['datos/publicaciones.json', 'datos/open-utm.json']
  const lecturas: Record<string, string> = {}

  for (const ruta of rutas) {
    if (!base) {
      lecturas[ruta] = 'sin base configurada'
      continue
    }
    try {
      const respuesta = await fetch(`${base}/${ruta}`, { cache: 'no-store' })
      lecturas[ruta] = `HTTP ${respuesta.status}`
    } catch (error) {
      lecturas[ruta] = `error: ${(error as Error).message}`
    }
  }

  return NextResponse.json({
    tieneToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    baseExplicita: explicita,
    baseDerivada: derivada,
    baseEnUso: base,
    lecturas,
    nota:
      'HTTP 200 = lectura directa correcta (0 operaciones avanzadas). ' +
      'HTTP 404 = el índice aún no existe; se creará al publicar. ' +
      'Cualquier otro resultado significa que se está usando el respaldo con list().',
  })
}
