import { Card, CardFooter } from '@heroui/react'
import Image from 'next/image'

const FOTOS = [
  {
    src: '/equipo-juan-xxiii.png',
    alt: 'Deportistas del Club UTM con sus medallas y trofeos en el Open Juan XXIII',
    pie: 'Podio completo en el 34° Open Internacional Juan XXIII',
  },
  {
    src: '/paratenis-juan-xxiii.png',
    alt: 'Medallistas de paratenis de mesa levantando los brazos en el podio del Open Juan XXIII',
    pie: 'Paratenis de mesa: campeones sin límites',
  },
  {
    src: '/open-internacional-copa-utm-2026.jpeg',
    alt: 'Afiche del I Open Internacional Copa UTM 2026, del 14 al 16 de agosto',
    pie: 'I Open Internacional Copa UTM 2026',
  },
]

export function Galeria() {
  return (
    <section id="galeria" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="epigrafe mb-3 text-sm text-pelota">Del muro</p>
        <h2 className="titular mb-3 text-4xl font-bold sm:text-5xl">La vida del club</h2>
        <p className="mb-9 max-w-2xl text-default-500">
          Momentos de nuestros deportistas dentro y fuera de la mesa. Todo lo demás lo publicamos en{' '}
          <a
            href="https://www.instagram.com/clubutmoficial/"
            target="_blank"
            rel="noopener"
            className="font-semibold text-azul underline decoration-pelota decoration-2 underline-offset-4"
          >
            @clubutmoficial
          </a>
          .
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {FOTOS.map((foto) => (
            <Card key={foto.src} shadow="sm" isFooterBlurred className="border border-default-200">
              <Image
                src={foto.src}
                alt={foto.alt}
                width={1080}
                height={1080}
                className="h-80 w-full object-cover"
              />
              <CardFooter className="absolute bottom-0 z-10 border-t border-white/20 bg-mesa/70">
                <p className="titular text-lg tracking-wide text-white">{foto.pie}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
