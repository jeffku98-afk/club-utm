'use client'

import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'

export function BotonSalir() {
  const router = useRouter()

  async function salir() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.replace('/')
    router.refresh()
  }

  return (
    <Button variant="bordered" radius="full" onPress={salir} className="titular tracking-wider">
      Cerrar sesión
    </Button>
  )
}
