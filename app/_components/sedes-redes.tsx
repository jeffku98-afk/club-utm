import { Card, CardBody } from '@heroui/react'

const SEDES = [
  {
    nombre: 'Sede Jesús María',
    detalle: 'Jesús María, Lima · Sede principal',
    mapa: 'https://maps.app.goo.gl/8nEcWrHbiZC1rUgw8',
  },
  {
    nombre: 'Sede Magdalena del Mar',
    detalle: 'Magdalena del Mar, Lima',
    mapa: 'https://maps.app.goo.gl/p6wG9UpWL83sFm8k8',
  },
]

const REDES = [
  {
    nombre: 'Instagram',
    usuario: '@clubutmoficial',
    url: 'https://www.instagram.com/clubutmoficial/',
    fondo: 'bg-mesa',
    icono: (
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.55 1.55 0 1 1-1.55-1.55A1.55 1.55 0 0 1 18.9 5.2z" />
    ),
  },
  {
    nombre: 'TikTok',
    usuario: '@clubutm',
    url: 'https://www.tiktok.com/@clubutm',
    fondo: 'bg-[#111A2E]',
    icono: (
      <path d="M16.5 2h-3v13.1a3 3 0 1 1-2.6-3v-3a6 6 0 1 0 5.6 6V9.4a7.4 7.4 0 0 0 4.4 1.4V7.9a4.4 4.4 0 0 1-4.4-4.4V2z" />
    ),
  },
]

export function SedesRedes() {
  return (
    <section id="sedes" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="epigrafe mb-3 text-sm text-pelota">Dónde encontrarnos</p>
        <h2 className="titular mb-3 text-4xl font-bold sm:text-5xl">Sedes y redes</h2>
        <p className="mb-9 max-w-2xl text-default-500">
          Dos locales en Lima y una comunidad que sigue creciendo. Escríbenos por redes o al
          987647459 para reservar tu clase de prueba.
        </p>

        <div className="mb-5 grid gap-5 md:grid-cols-2">
          {SEDES.map((sede) => (
            <Card key={sede.nombre} shadow="none" className="border border-default-200">
              <CardBody className="gap-2 p-6">
                <h3 className="titular text-2xl font-semibold">{sede.nombre}</h3>
                <p className="text-sm text-default-500">{sede.detalle}</p>
                <a
                  href={sede.mapa}
                  target="_blank"
                  rel="noopener"
                  className="titular mt-2 self-start border-b-2 border-pelota pb-0.5 tracking-wider text-azul"
                >
                  Abrir en Google Maps
                </a>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {REDES.map((red) => (
            <a
              key={red.nombre}
              href={red.url}
              target="_blank"
              rel="noopener"
              className={`${red.fondo} flex w-fit items-center gap-3 rounded-full py-2.5 pl-4 pr-6 text-white transition-colors hover:bg-pelota`}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-current" aria-hidden>
                {red.icono}
              </svg>
              <span className="leading-tight">
                <span className="titular block text-lg font-semibold tracking-wide">{red.nombre}</span>
                <span className="text-xs text-white/70">{red.usuario}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
