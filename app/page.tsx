import { listarPublicaciones } from '@/lib/almacen'
import { Galeria } from './_components/galeria'
import { MisionVision } from './_components/mision-vision'
import { NavegacionPrincipal } from './_components/navegacion-principal'
import { NotaPrensa } from './_components/nota-prensa'
import { PiePagina } from './_components/pie-pagina'
import { Portada } from './_components/portada'
import { Publicaciones } from './_components/publicaciones'
import { SedesRedes } from './_components/sedes-redes'

export const revalidate = 3600

export default async function PaginaInicio() {
  const publicaciones = await listarPublicaciones()

  return (
    <>
      <NavegacionPrincipal />
      <main>
        <Portada />
        <MisionVision />
        <NotaPrensa />
        <Galeria />
        <Publicaciones iniciales={publicaciones} />
        <SedesRedes />
      </main>
      <PiePagina />
    </>
  )
}
