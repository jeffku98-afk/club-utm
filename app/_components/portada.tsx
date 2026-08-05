import { Button } from '@heroui/react'
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

        <div className="relative hidden h-60 lg:block" aria-hidden>
          <svg viewBox="0 0 74 96" className="absolute bottom-0 left-0 h-24 w-[74px]">
            <ellipse cx="37" cy="36" rx="32" ry="35" fill="#FF6B1A" />
            <ellipse cx="37" cy="36" rx="25" ry="28" fill="#E85C0E" />
            <rect x="30" y="66" width="14" height="30" rx="6" fill="#F4F6FB" />
          </svg>
          <svg viewBox="0 0 74 96" className="absolute bottom-0 right-0 h-24 w-[74px] -scale-x-100">
            <ellipse cx="37" cy="36" rx="32" ry="35" fill="#FFFFFF" />
            <ellipse cx="37" cy="36" rx="25" ry="28" fill="#14509B" />
            <rect x="30" y="66" width="14" height="30" rx="6" fill="#FFA24D" />
          </svg>
          <div className="sombra-rally absolute bottom-7 left-[8%] h-2 w-[38px] rounded-full bg-black/30 blur-[2px]" />
          <div className="pelota-rally absolute left-[8%] h-[38px] w-[38px] rounded-full bg-[radial-gradient(circle_at_32%_30%,#FFC48A,#FF6B1A_62%)] shadow-lg" />
        </div>
      </div>
    </section>
  )
}
