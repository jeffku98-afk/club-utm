import { createClient, type RedisClientType } from 'redis'

export interface ResumenVisitas {
  total: number
  hoy: number
  ultimos7Dias: { fecha: string; visitas: number }[]
  disponible: boolean
}

const CLAVE_TOTAL = 'visitas:total'
const PREFIJO_DIA = 'visitas:dia:'
const DIAS_RETENIDOS = 60 * 60 * 24 * 120

let conexion: Promise<RedisClientType> | null = null

function urlRedis(): string | undefined {
  return process.env.REDIS_URL ?? process.env.KV_URL
}

/**
 * Reutiliza la conexión entre invocaciones de la misma instancia serverless.
 * Si la conexión se pierde, se descarta para que la siguiente llamada reconecte.
 */
async function obtenerCliente(): Promise<RedisClientType | null> {
  const url = urlRedis()
  if (!url) return null

  if (!conexion) {
    const cliente: RedisClientType = createClient({ url })
    cliente.on('error', () => {
      conexion = null
    })
    conexion = cliente.connect().then(() => cliente)
  }

  try {
    return await conexion
  } catch {
    conexion = null
    return null
  }
}

/** Fecha en formato AAAA-MM-DD según la zona horaria de Lima. */
function fechaLima(fecha: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fecha)
}

export async function registrarVisita(): Promise<void> {
  try {
    const redis = await obtenerCliente()
    if (!redis) return

    const clave = `${PREFIJO_DIA}${fechaLima(new Date())}`
    await redis
      .multi()
      .incr(CLAVE_TOTAL)
      .incr(clave)
      .expire(clave, DIAS_RETENIDOS)
      .exec()
  } catch (error) {
    console.error('No se pudo registrar la visita:', error)
  }
}

export async function obtenerResumenVisitas(): Promise<ResumenVisitas> {
  const vacio: ResumenVisitas = { total: 0, hoy: 0, ultimos7Dias: [], disponible: false }

  try {
    const redis = await obtenerCliente()
    if (!redis) return vacio

    const dias = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - (6 - i))
      return fechaLima(fecha)
    })

    const valores = await redis.mGet([
      CLAVE_TOTAL,
      ...dias.map((fecha) => `${PREFIJO_DIA}${fecha}`),
    ])

    const total = Number(valores[0] ?? 0)
    const ultimos7Dias = dias.map((fecha, i) => ({
      fecha,
      visitas: Number(valores[i + 1] ?? 0),
    }))

    return {
      total,
      hoy: ultimos7Dias[6]?.visitas ?? 0,
      ultimos7Dias,
      disponible: true,
    }
  } catch (error) {
    console.error('No se pudo leer el contador de visitas:', error)
    return vacio
  }
}