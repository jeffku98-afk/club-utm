import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { eliminarPublicacion } from '@/lib/almacen'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'

export const runtime = 'nodejs'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await sesionValida(req.cookies.get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
  }

  const { id } = await params
  const eliminada = await eliminarPublicacion(id)
  if (!eliminada) return NextResponse.json({ error: 'La publicación ya no existe.' }, { status: 404 })

  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
