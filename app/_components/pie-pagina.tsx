import Image from 'next/image'

const AUSPICIADORES = [
  { nombre: 'Ink Sport', archivo: '/auspiciadores/ink-sport.png', alto: 'h-12' },
  { nombre: 'Sport Play Fitness', archivo: '/auspiciadores/sport-play.png', alto: 'h-14' },
  { nombre: 'Tenimesistas', archivo: '/auspiciadores/tenimesistas.png', alto: 'h-8' },
  { nombre: 'Chole', archivo: '/auspiciadores/chole.png', alto: 'h-14' },
]

export function PiePagina() {
  return (
    <footer>
      <section className="border-t border-default-200 bg-white px-6 py-10" aria-labelledby="auspiciadores">
        <div className="mx-auto max-w-6xl">
          <h2 id="auspiciadores" className="epigrafe mb-6 text-center text-xs text-default-400">
            Auspiciadores
          </h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {AUSPICIADORES.map((auspiciador) => (
              <li key={auspiciador.nombre}>
                <Image
                  src={auspiciador.archivo}
                  alt={auspiciador.nombre}
                  width={600}
                  height={300}
                  className={`${auspiciador.alto} w-auto object-contain`}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="bg-mesa px-6 py-11 text-sm text-white/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="titular text-lg font-semibold tracking-wider text-white">
              Club UTM · Unidos por el tenis de mesa
            </p>
            <p>Jesús María y Magdalena del Mar · Lima, Perú · clubutm@gmail.com</p>
          </div>
          <Image
            src="/mascota-utm.png"
            alt=""
            width={784}
            height={1312}
            className="hidden h-24 w-auto sm:block"
          />
        </div>
      </div>
    </footer>
  )
}