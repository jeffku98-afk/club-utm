import { Suspense } from 'react'
import { FormularioAcceso } from './formulario-acceso'

export const metadata = { robots: { index: false, follow: false } }

export default function PaginaAcceso() {
  return (
    <main className="mesa-lineas relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <Suspense>
        <FormularioAcceso />
      </Suspense>
    </main>
  )
}
