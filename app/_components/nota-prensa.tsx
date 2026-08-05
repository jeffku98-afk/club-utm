import { Button } from '@heroui/react'
import Link from 'next/link'

const REEL = 'https://www.instagram.com/reel/DWKUkJcjFRo/'

export function NotaPrensa() {
  return (
    <section id="prensa" className="bg-mesa px-6 py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div>
          <p className="epigrafe mb-4 flex items-center gap-2 text-sm text-pelota-suave">
            <span className="h-2 w-2 rounded-full bg-pelota" />
            En los medios
          </p>
          <h2 className="titular mb-4 text-4xl font-bold sm:text-5xl">
            Latina visitó el club y contó <span className="text-pelota-suave">nuestra historia</span>
          </h2>
          <p className="mb-7 max-w-lg text-white/75">
            El canal Latina llegó hasta nuestras mesas para mostrar cómo el tenis de mesa está
            creciendo en Jesús María y Magdalena del Mar.
          </p>
          <Button
            as={Link}
            href={REEL}
            target="_blank"
            rel="noopener"
            color="primary"
            radius="full"
            size="lg"
            className="titular text-lg tracking-wider"
          >
            Ver la nota en Instagram
          </Button>
        </div>

        <div className="flex justify-center rounded-2xl bg-white p-3">
          <iframe
            src={`${REEL}embed`}
            title="Nota de Latina sobre el Club UTM"
            className="h-[640px] w-full max-w-[420px] rounded-lg border-0"
            loading="lazy"
            scrolling="no"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
