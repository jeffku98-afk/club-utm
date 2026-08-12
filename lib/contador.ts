import { Redis } from '@upstash/redis'

export interface ResumenVisitas {
  total: number
  hoy: number
  ultimos7Dias: { fecha: string; visitas: number }[]
  disponible: boolean
}

const CLAVE_TOTAL = 'visitas:total'
const PREFIJO_DIA = 'visitas:dia:'
const DIAS_RETENIDOS = 60 * 60 * 24 * 120

let cliente: Redis | null = null

function obtenerCliente(): Redis | null {
  if (cliente) return cliente
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null

  cliente = new Redis({ url, token })
  return cliente
}

function claveDia(fecha: Date): string {
  return `${PREFIJO_DIA}${fechaLima(fecha)}`
}

/** Fecha en formato AAAA-MM-DD según la zona horaria de Lima (UTC-5). */
function fechaLima(fecha: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fecha)
}

export async function registrarVisita(): Promise<void> {
  const redis = obtenerCliente()
  if (!redis) return

  const clave = claveDia(new Date())
  await Promise.all([
    redis.incr(CLAVE_TOTAL),
    redis.incr(clave).then(() => redis.expire(clave, DIAS_RETENIDOS)),
  ])
}

export async function obtenerResumenVisitas(): Promise<ResumenVisitas> {
  const redis = obtenerCliente()
  if (!redis) return { total: 0, hoy: 0, ultimos7Dias: [], disponible: false }

  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - (6 - i))
    return fechaLima(fecha)
  })

  const [total, ...conteos] = await redis.mget<(number | null)[]>(
    CLAVE_TOTAL,
    ...dias.map((fecha) => `${PREFIJO_DIA}${fecha}`),
  )

  const ultimos7Dias = dias.map((fecha, i) => ({ fecha, visitas: conteos[i] ?? 0 }))

  return {
    total: total ?? 0,
    hoy: ultimos7Dias[6]?.visitas ?? 0,
    ultimos7Dias,
    disponible: true,
  }
}
