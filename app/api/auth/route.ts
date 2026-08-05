import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_SESION, crearTokenSesion } from '@/lib/sesion'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { clave } = (await req.json()) as { clave?: string }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'El acceso no está configurado en el servidor.' }, { status: 500 })
  }

  if (clave !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Clave incorrecta.' }, { status: 401 })
  }

  const { token, expiraEn } = await crearTokenSesion()
  const respuesta = NextResponse.json({ ok: true })
  respuesta.cookies.set(COOKIE_SESION, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiraEn),
  })
  return respuesta
}

export async function DELETE() {
  const respuesta = NextResponse.json({ ok: true })
  respuesta.cookies.delete(COOKIE_SESION)
  return respuesta
}
