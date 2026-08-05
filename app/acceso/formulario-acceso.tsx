'use client'

import { Button, Card, CardBody, Input } from '@heroui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function FormularioAcceso() {
  const router = useRouter()
  const parametros = useSearchParams()
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function ingresar() {
    setEnviando(true)
    setError('')

    const respuesta = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave }),
    })

    if (!respuesta.ok) {
      setError((await respuesta.json()).error ?? 'No se pudo iniciar sesión.')
      setEnviando(false)
      return
    }

    router.replace(parametros.get('volver') ?? '/gestion')
    router.refresh()
  }

  return (
    <Card className="z-10 w-full max-w-sm border-t-4 border-t-pelota" shadow="lg">
      <CardBody className="gap-4 p-8">
        <h1 className="titular text-3xl font-bold">Acceso interno</h1>
        <p className="text-sm text-default-500">
          Área de gestión del Club UTM. Ingresa la clave para publicar torneos y noticias.
        </p>
        <Input
          type="password"
          label="Clave"
          value={clave}
          onValueChange={setClave}
          onKeyDown={(e) => e.key === 'Enter' && ingresar()}
          isInvalid={!!error}
          errorMessage={error}
          autoFocus
        />
        <Button color="primary" radius="full" isLoading={enviando} onPress={ingresar}>
          Entrar
        </Button>
      </CardBody>
    </Card>
  )
}
