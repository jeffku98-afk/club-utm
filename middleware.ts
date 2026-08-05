import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'

export async function middleware(req: NextRequest) {
  const autenticado = await sesionValida(req.cookies.get(COOKIE_SESION)?.value)

  if (!autenticado) {
    const destino = new URL('/acceso', req.url)
    destino.searchParams.set('volver', req.nextUrl.pathname)
    return NextResponse.redirect(destino)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/gestion/:path*'],
}
