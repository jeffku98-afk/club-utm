import { listarPublicaciones, obtenerTorneo } from '@/lib/almacen'
import { BotonSalir } from './_components/boton-salir'
import { FormularioPublicacion } from './_components/formulario-publicacion'
import { GestionTorneo } from './_components/gestion-torneo'
import { TablaPublicaciones } from './_components/tabla-publicaciones'

export const metadata = { robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function PaginaGestion() {
  const [publicaciones, torneo] = await Promise.all([listarPublicaciones(), obtenerTorneo()])

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="epigrafe mb-2 text-sm text-pelota">Área interna</p>
          <h1 className="titular text-4xl font-bold">Gestión de eventos y noticias</h1>
          <p className="mt-1 text-default-500">
            Lo que publiques aquí aparece de inmediato en la página del club.
          </p>
        </div>
        <BotonSalir />
      </header>

      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <FormularioPublicacion />
        <TablaPublicaciones iniciales={publicaciones} />
      </div>

      <div className="mt-10">
        <GestionTorneo inicial={torneo} />
      </div>
    </main>
  )
}
