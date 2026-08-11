import { Button } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'
import { obtenerTorneo } from '@/lib/almacen'
import { NavegacionPrincipal } from '../_components/navegacion-principal'
import { PiePagina } from '../_components/pie-pagina'
import { DocumentosTorneo } from './documentos-torneo'

export const revalidate = 3600

export const metadata = {
  title: 'I Open Internacional Copa UTM 2026 · Club UTM',
  description:
    'Bases, inscripciones, tabla horaria, sorteos y resultados del I Open Internacional Copa UTM 2026, del 14 al 16 de agosto en el Coliseo del Club Lawn Tennis de la Exposición.',
}

export default async function PaginaTorneo() {
  const torneo = await obtenerTorneo()

  return (
    <>
      <NavegacionPrincipal />
      <main>
        <section className="mesa-lineas relative overflow-hidden px-6 py-16 text-white">
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="epigrafe mb-4 flex items-center gap-2 text-sm text-pelota-suave">
                <span className="h-2 w-2 rounded-full bg-pelota" />
                14 al 16 de agosto · Lima
              </p>
              <h1 className="titular mb-5 text-5xl font-bold sm:text-6xl">
                I Open Internacional <span className="text-pelota">Copa UTM 2026</span>
              </h1>
              <p className="mb-6 max-w-xl text-white/80">
                Coliseo del Club Lawn Tennis de la Exposición. Categorías oficiales del circuito
                nacional con puntaje para el ranking, categorías complementarias para no rankeados y
                categoría paratenis de mesa.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  as="a"
                  href="mailto:clubutm@gmail.com"
                  color="primary"
                  radius="full"
                  size="lg"
                  className="titular text-lg tracking-wider"
                >
                  Informes e inscripciones
                </Button>
                {torneo.galeriaUrl && (
                  <Button
                    as="a"
                    href={torneo.galeriaUrl}
                    target="_blank"
                    rel="noopener"
                    variant="bordered"
                    radius="full"
                    size="lg"
                    className="titular border-white/60 text-lg tracking-wider text-white"
                  >
                    Galería de fotos
                  </Button>
                )}
              </div>
            </div>

            <Image
              src="/open-internacional-copa-utm-2026.jpeg"
              alt="Afiche del I Open Internacional Copa UTM 2026"
              width={1000}
              height={1500}
              priority
              className="mx-auto w-full max-w-sm rounded-2xl shadow-2xl"
            />
          </div>
        </section>

        <section className="bg-papel px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="epigrafe mb-3 text-sm text-pelota">Documentos del torneo</p>
            <h2 className="titular mb-3 text-4xl font-bold">Toda la información oficial</h2>
            <p className="mb-8 text-default-500">
              Cada documento se puede ver aquí mismo o descargar. Se actualizan conforme avanza la
              competencia.
            </p>

            <DocumentosTorneo inicial={torneo} />

            <div className="mt-8 rounded-2xl border border-default-200 bg-white p-7">
              <h3 className="titular text-2xl font-semibold">Galería de fotos</h3>
              {torneo.galeriaUrl ? (
                <>
                  <p className="mt-1 text-sm text-default-500">
                    Todas las fotos del torneo están en Google Drive.
                  </p>
                  <Button
                    as="a"
                    href={torneo.galeriaUrl}
                    target="_blank"
                    rel="noopener"
                    color="primary"
                    radius="full"
                    className="titular mt-4 tracking-wider"
                  >
                    Abrir la galería
                  </Button>
                </>
              ) : (
                <p className="mt-1 text-sm text-default-400">
                  Publicaremos el enlace apenas terminemos de subir las fotos.
                </p>
              )}
            </div>

            <div className="mt-10 text-center">
              <Link href="/" className="titular tracking-wider text-azul underline underline-offset-4">
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PiePagina />
    </>
  )
}
