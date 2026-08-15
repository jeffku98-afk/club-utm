import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_SESION, sesionValida } from '@/lib/sesion'

export const runtime = 'nodejs'

const TAMANO_MAXIMO = 20 * 1024 * 1024

const TIPOS_PERMITIDOS = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
]

export async function POST(req: NextRequest) {
  const cuerpo = (await req.json()) as HandleUploadBody

  if (cuerpo.type === 'blob.generate-client-token') {
    const autenticado = await sesionValida(req.cookies.get(COOKIE_SESION)?.value)
    if (!autenticado) {
      return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
    }
  }

  try {
    const respuesta = await handleUpload({
      body: cuerpo,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: TIPOS_PERMITIDOS,
        maximumSizeInBytes: TAMANO_MAXIMO,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
      },
    })

    return NextResponse.json(respuesta)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}