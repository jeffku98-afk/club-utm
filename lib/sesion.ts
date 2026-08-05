export const COOKIE_SESION = 'utm_sesion'
const DURACION_MS = 1000 * 60 * 60 * 8

const codificador = new TextEncoder()

function claveSecreta(): Promise<CryptoKey> {
  const secreto = process.env.SESSION_SECRET
  if (!secreto) throw new Error('Falta SESSION_SECRET en las variables de entorno')
  return crypto.subtle.importKey(
    'raw',
    codificador.encode(secreto),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function aBase64Url(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function deBase64Url(texto: string): ArrayBuffer {
  const base64 = texto.replace(/-/g, '+').replace(/_/g, '/')
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return bytes.buffer as ArrayBuffer
}

export async function crearTokenSesion(): Promise<{ token: string; expiraEn: number }> {
  const expiraEn = Date.now() + DURACION_MS
  const carga = String(expiraEn)
  const firma = await crypto.subtle.sign('HMAC', await claveSecreta(), codificador.encode(carga))
  return { token: `${carga}.${aBase64Url(firma)}`, expiraEn }
}

export async function sesionValida(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const [carga, firma] = token.split('.')
  if (!carga || !firma) return false
  if (Number(carga) < Date.now()) return false

  const esValida = await crypto.subtle.verify(
    'HMAC',
    await claveSecreta(),
    deBase64Url(firma),
    codificador.encode(carga),
  )
  return esValida
}
