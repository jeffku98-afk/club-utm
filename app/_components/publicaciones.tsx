'use client'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'
import { CLAVE_PUBLICACIONES, fechaLarga, obtenerPublicaciones } from '@/lib/api'
import type { Publicacion } from '@/lib/tipos'

type Filtro = 'todo' | 'torneo' | 'noticia'

export function Publicaciones({ iniciales }: { iniciales: Publicacion[] }) {
  const [filtro, setFiltro] = useState<Filtro>('todo')
  const [seleccionada, setSeleccionada] = useState<Publicacion | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { data: publicaciones = [] } = useQuery({
    queryKey: CLAVE_PUBLICACIONES,
    queryFn: obtenerPublicaciones,
    initialData: iniciales,
  })

  const visibles = publicaciones.filter((p) => filtro === 'todo' || p.tipo === filtro)

  function verDetalle(publicacion: Publicacion) {
    setSeleccionada(publicacion)
    onOpen()
  }

  return (
    <section id="publicaciones" className="bg-papel px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="epigrafe mb-3 text-sm text-pelota">Agenda</p>
        <h2 className="titular mb-3 text-4xl font-bold sm:text-5xl">Eventos y noticias</h2>
        <p className="mb-7 max-w-2xl text-default-500">
          Torneos, fechas de inscripción y avisos del club. Las bases de cada torneo se descargan en
          PDF.
        </p>

        <Tabs
          aria-label="Filtrar publicaciones"
          selectedKey={filtro}
          onSelectionChange={(clave) => setFiltro(clave as Filtro)}
          radius="full"
          color="secondary"
          className="mb-7"
          classNames={{ tabContent: 'titular tracking-wider' }}
        >
          <Tab key="todo" title="Todo" />
          <Tab key="torneo" title="Torneos" />
          <Tab key="noticia" title="Noticias" />
        </Tabs>

        {visibles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-default-300 bg-white p-10 text-center text-default-500">
            Todavía no hay publicaciones en esta categoría. Síguenos en Instagram para enterarte
            primero.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibles.map((publicacion) => (
              <TarjetaPublicacion
                key={publicacion.id}
                publicacion={publicacion}
                onVerDetalle={() => verDetalle(publicacion)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
        <ModalContent>
          {(cerrar) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="titular text-2xl">{seleccionada?.titulo}</span>
                <span className="text-sm font-normal text-default-500">
                  {seleccionada && fechaLarga(seleccionada.fecha)}
                  {seleccionada?.sede && ` · ${seleccionada.sede}`}
                </span>
              </ModalHeader>
              <ModalBody>
                {seleccionada?.imagenUrl && (
                  <Image
                    src={seleccionada.imagenUrl}
                    alt={seleccionada.titulo}
                    width={1200}
                    height={1600}
                    className="w-full rounded-xl object-contain"
                  />
                )}
                <p className="whitespace-pre-wrap text-default-700">{seleccionada?.resumen}</p>
              </ModalBody>
              <ModalFooter>
                {seleccionada?.basesUrl && (
                  <Button
                    as="a"
                    href={seleccionada.basesUrl}
                    target="_blank"
                    rel="noopener"
                    color="secondary"
                    radius="full"
                    className="titular tracking-wider"
                  >
                    Descargar adjunto
                  </Button>
                )}
                <Button variant="light" radius="full" onPress={cerrar} className="titular tracking-wider">
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  )
}

function TarjetaPublicacion({
  publicacion,
  onVerDetalle,
}: {
  publicacion: Publicacion
  onVerDetalle: () => void
}) {
  return (
    <Card shadow="sm" className="border border-default-200">
      {publicacion.imagenUrl && (
        <Image
          src={publicacion.imagenUrl}
          alt={publicacion.titulo}
          width={800}
          height={600}
          className="h-48 w-full object-cover"
        />
      )}
      <CardBody className="items-start gap-3">
        <Chip
          size="sm"
          radius="full"
          className={`titular w-fit tracking-widest text-white ${
            publicacion.tipo === 'noticia' ? 'bg-azul' : 'bg-pelota'
          }`}
        >
          {publicacion.tipo === 'noticia' ? 'Noticia' : 'Torneo'}
        </Chip>
        <h3 className="titular text-2xl font-semibold">{publicacion.titulo}</h3>
        <p className="text-sm font-medium text-default-500">
          {fechaLarga(publicacion.fecha)}
          {publicacion.sede && ` · ${publicacion.sede}`}
        </p>
        <p className="line-clamp-3 text-sm text-default-700">{publicacion.resumen}</p>
      </CardBody>
      <CardFooter className="gap-2">
        <Button
          color="primary"
          radius="full"
          size="sm"
          onPress={onVerDetalle}
          className="titular tracking-wider"
        >
          Ver detalles
        </Button>
        {publicacion.basesUrl && (
          <Button
            as="a"
            href={publicacion.basesUrl}
            target="_blank"
            rel="noopener"
            variant="bordered"
            radius="full"
            size="sm"
            className="titular tracking-wider"
          >
            Bases (PDF)
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
