'use client'

import { Button, Card, CardBody, CardFooter, Chip, Tab, Tabs } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'
import { CLAVE_PUBLICACIONES, fechaLarga, obtenerPublicaciones } from '@/lib/api'
import type { Publicacion } from '@/lib/tipos'

type Filtro = 'todo' | 'torneo' | 'noticia'

export function Publicaciones({ iniciales }: { iniciales: Publicacion[] }) {
  const [filtro, setFiltro] = useState<Filtro>('todo')

  const { data: publicaciones = [] } = useQuery({
    queryKey: CLAVE_PUBLICACIONES,
    queryFn: obtenerPublicaciones,
    initialData: iniciales,
  })

  const visibles = publicaciones.filter((p) => filtro === 'todo' || p.tipo === filtro)

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
              <TarjetaPublicacion key={publicacion.id} publicacion={publicacion} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TarjetaPublicacion({ publicacion }: { publicacion: Publicacion }) {
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
        <p className="text-sm text-default-700">{publicacion.resumen}</p>
      </CardBody>
      {publicacion.basesUrl && (
        <CardFooter>
          <Button
            as="a"
            href={publicacion.basesUrl}
            target="_blank"
            rel="noopener"
            color="secondary"
            radius="full"
            className="titular tracking-wider"
          >
            Descargar bases (PDF)
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
