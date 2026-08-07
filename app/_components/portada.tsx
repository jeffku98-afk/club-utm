import { Button } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'

export function Portada() {
  return (
    <section className="mesa-lineas relative overflow-hidden px-6 py-20 text-white">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="epigrafe mb-4 flex items-center gap-2 text-sm text-pelota-suave">
            <span className="h-2 w-2 rounded-full bg-pelota" />
            Jesús María · Magdalena del Mar · Lima
          </p>
          <h1 className="titular mb-5 text-5xl font-bold sm:text-6xl lg:text-7xl">
            Aquí la pelota <span className="text-pelota">nunca</span> deja de rebotar
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/80">
            Entrenamos, competimos y hacemos comunidad alrededor de una mesa. Niños, jóvenes y
            adultos, desde la primera raqueta hasta el circuito nacional y el paratenis de mesa.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              as={Link}
              href="#publicaciones"
              color="primary"
              radius="full"
              size="lg"
              className="titular text-lg tracking-wider"
            >
              Ver próximos torneos
            </Button>
            <Button
              as={Link}
              href="#sedes"
              variant="bordered"
              radius="full"
              size="lg"
              className="titular border-white/60 text-lg tracking-wider text-white"
            >
              Cómo llegar
            </Button>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end" aria-hidden>
          <div className="pelota-rebote absolute left-4 top-6 h-10 w-10 rounded-full bg-[radial-gradient(circle_at_32%_30%,#FFC48A,#FF6B1A_62%)] shadow-lg sm:left-10" />
          <Image
            src="/mascota-utm.png"
            alt=""
            width={784}
            height={1312}
            priority
            className="h-[340px] w-auto drop-shadow-2xl sm:h-[420px] lg:h-[460px]"
          />
        </div>
      </div>
    </section>
  )
}