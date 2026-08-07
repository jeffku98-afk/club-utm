import Image from 'next/image'

export function PiePagina() {
  return (
    <footer className="bg-mesa px-6 py-11 text-sm text-white/70">
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
    </footer>
  )
}