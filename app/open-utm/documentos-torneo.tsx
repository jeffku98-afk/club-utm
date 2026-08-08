'use client'

import { Accordion, AccordionItem, Button, Chip } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { CLAVE_TORNEO, obtenerTorneoCliente } from '@/lib/api'
import { SECCIONES_TORNEO, type DocumentoTorneo, type Torneo } from '@/lib/tipos'

export function DocumentosTorneo({ inicial }: { inicial: Torneo }) {
  const { data: torneo = inicial } = useQuery({
    queryKey: CLAVE_TORNEO,
    queryFn: obtenerTorneoCliente,
    initialData: inicial,
  })

  return (
    <Accordion
      variant="splitted"
      selectionMode="multiple"
      defaultExpandedKeys={['bases']}
      className="px-0"
    >
      {SECCIONES_TORNEO.map((seccion) => {
        const documento = torneo.documentos[seccion.clave]

        return (
          <AccordionItem
            key={seccion.clave}
            aria-label={seccion.titulo}
            title={<span className="titular text-xl tracking-wide">{seccion.titulo}</span>}
            subtitle={
              documento ? (
                <span className="text-xs text-default-500">{documento.nombre}</span>
              ) : (
                <span className="text-xs text-default-400">Pendiente de publicación</span>
              )
            }
            startContent={
              <Chip
                size="sm"
                radius="full"
                className={`titular tracking-widest text-white ${
                  documento ? 'bg-pelota' : 'bg-default-300'
                }`}
              >
                {documento ? 'Disponible' : 'Pronto'}
              </Chip>
            }
            className="border border-default-200 shadow-none"
          >
            {documento ? <Visor documento={documento} /> : <MensajePendiente />}
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

function MensajePendiente() {
  return (
    <p className="pb-4 text-sm text-default-500">
      Este documento aún no está publicado. Lo subiremos aquí apenas esté listo.
    </p>
  )
}

function Visor({ documento }: { documento: DocumentoTorneo }) {
  const fuente =
    documento.formato === 'excel'
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documento.url)}`
      : `${documento.url}#view=FitH`

  return (
    <div className="pb-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <Button
          as="a"
          href={documento.url}
          target="_blank"
          rel="noopener"
          color="secondary"
          radius="full"
          size="sm"
          className="titular tracking-wider"
        >
          Descargar
        </Button>
        <Button
          as="a"
          href={documento.url}
          target="_blank"
          rel="noopener"
          variant="bordered"
          radius="full"
          size="sm"
          className="titular tracking-wider md:hidden"
        >
          Abrir en pantalla completa
        </Button>
      </div>

      <iframe
        src={fuente}
        title={documento.nombre}
        className="hidden h-[70vh] w-full rounded-xl border border-default-200 md:block"
        loading="lazy"
      />

      <p className="mt-3 text-xs text-default-400 md:hidden">
        La vista previa se muestra en pantallas grandes. Desde el celular, abre o descarga el
        archivo.
      </p>
    </div>
  )
}
