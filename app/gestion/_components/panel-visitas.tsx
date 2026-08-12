'use client'

import { Card, CardBody } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import type { ResumenVisitas } from '@/lib/contador'

async function obtenerVisitas(): Promise<ResumenVisitas> {
  const respuesta = await fetch('/api/visitas')
  if (!respuesta.ok) throw new Error('No se pudieron cargar las visitas.')
  return respuesta.json()
}

export function PanelVisitas({ inicial }: { inicial: ResumenVisitas }) {
  const { data: visitas = inicial } = useQuery({
    queryKey: ['visitas'],
    queryFn: obtenerVisitas,
    initialData: inicial,
    refetchInterval: 60_000,
  })

  if (!visitas.disponible) {
    return (
      <Card shadow="none" className="border border-default-200">
        <CardBody className="p-6 text-sm text-default-500">
          El contador de visitas no está configurado. Falta conectar la base de datos Redis en
          Vercel.
        </CardBody>
      </Card>
    )
  }

  const maximo = Math.max(...visitas.ultimos7Dias.map((d) => d.visitas), 1)

  return (
    <Card shadow="none" className="border border-default-200">
      <CardBody className="gap-5 p-6">
        <div className="flex flex-wrap items-end gap-8">
          <div>
            <p className="epigrafe text-xs text-default-400">Visitas totales</p>
            <p className="titular text-4xl font-bold text-mesa">
              {visitas.total.toLocaleString('es-PE')}
            </p>
          </div>
          <div>
            <p className="epigrafe text-xs text-default-400">Hoy</p>
            <p className="titular text-4xl font-bold text-pelota">
              {visitas.hoy.toLocaleString('es-PE')}
            </p>
          </div>
        </div>

        <div>
          <p className="epigrafe mb-3 text-xs text-default-400">Últimos 7 días</p>
          <ul className="flex h-28 items-end gap-2">
            {visitas.ultimos7Dias.map((dia) => (
              <li key={dia.fecha} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-default-500">{dia.visitas}</span>
                <span
                  className="w-full rounded-t bg-azul"
                  style={{ height: `${Math.max((dia.visitas / maximo) * 72, 3)}px` }}
                />
                <span className="text-[10px] text-default-400">{etiquetaDia(dia.fecha)}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  )
}

function etiquetaDia(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-PE', {
    weekday: 'short',
    day: 'numeric',
  })
}
