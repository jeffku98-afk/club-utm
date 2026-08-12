'use client'

import { useEffect } from 'react'

const CLAVE_SESION = 'utm:visita-registrada'

export function RegistroVisita() {
  useEffect(() => {
    if (sessionStorage.getItem(CLAVE_SESION)) return
    sessionStorage.setItem(CLAVE_SESION, '1')

    fetch('/api/visitas', { method: 'POST', keepalive: true }).catch(() => null)
  }, [])

  return null
}
