import { Card, CardBody } from '@heroui/react'

const VALORES = [
  { titulo: 'Disciplina', detalle: 'Constancia en cada entrenamiento' },
  { titulo: 'Comunidad', detalle: 'El club es la gente que lo llena' },
  { titulo: 'Formación', detalle: 'De la escuela al circuito nacional' },
  { titulo: 'Inclusión', detalle: 'Paratenis de mesa, todos a la mesa' },
]

export function MisionVision() {
  return (
    <section id="club" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="epigrafe mb-3 text-sm text-pelota">El club</p>
        <h2 className="titular mb-3 text-4xl font-bold sm:text-5xl">Misión y visión</h2>
        <p className="mb-9 max-w-2xl text-default-500">
          Lo que nos mueve cada vez que se abre la puerta del local y suena el primer saque.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <Card shadow="none" className="border border-default-200 border-t-4 border-t-pelota">
            <CardBody className="gap-3 p-7">
              <h3 className="titular text-2xl font-semibold">Misión</h3>
              <p className="text-default-700">
                Promover y desarrollar el tenis de mesa en Lima como herramienta de formación
                deportiva y social, con entrenamiento accesible y de calidad para todas las edades y
                niveles, en un ambiente sano, disciplinado y familiar.
              </p>
            </CardBody>
          </Card>

          <Card shadow="none" className="border border-default-200 border-t-4 border-t-azul">
            <CardBody className="gap-3 p-7">
              <h3 className="titular text-2xl font-semibold">Visión</h3>
              <p className="text-default-700">
                Ser un club referente del tenis de mesa peruano: semillero de deportistas
                competitivos, sede de torneos internacionales y punto de encuentro de una comunidad
                que crece unida alrededor de la mesa.
              </p>
            </CardBody>
          </Card>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VALORES.map((valor) => (
            <li key={valor.titulo} className="rounded-xl bg-mesa px-4 py-5 text-center text-white">
              <span className="titular text-xl font-semibold tracking-wide">{valor.titulo}</span>
              <span className="mt-1 block text-sm text-white/70">{valor.detalle}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
