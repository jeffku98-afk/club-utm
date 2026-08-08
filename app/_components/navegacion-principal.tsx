'use client'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const SECCIONES = [
  { href: '/#club', etiqueta: 'El club' },
  { href: '/open-utm', etiqueta: 'Open UTM 2026', destacado: true },
  { href: '/#publicaciones', etiqueta: 'Eventos y noticias' },
  { href: '/#prensa', etiqueta: 'Prensa' },
  { href: '/#galeria', etiqueta: 'Galería' },
  { href: '/#sedes', etiqueta: 'Sedes y redes' },
]

export function NavegacionPrincipal() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <Navbar
      isMenuOpen={menuAbierto}
      onMenuOpenChange={setMenuAbierto}
      maxWidth="xl"
      height="5.5rem"
      classNames={{
        base: 'bg-mesa/95 backdrop-blur border-b-2 border-pelota',
        wrapper: 'px-6',
        item: 'text-white/80 data-[active=true]:text-white',
        toggleIcon: 'text-white',
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden text-white" aria-label="Abrir menú" />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-utm.jpeg"
              alt="Club UTM"
              width={72}
              height={72}
              className="h-16 w-16 rounded-full bg-white object-contain p-0.5 ring-2 ring-pelota"
              priority
            />
            <span className="leading-none">
              <span className="titular block text-3xl font-bold leading-none text-white">Club UTM</span>
              <span className="epigrafe block text-[11px] text-pelota-suave">
                Unidos por el tenis de mesa
              </span>
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="hidden sm:flex gap-1">
        {SECCIONES.map((seccion) => (
          <NavbarItem key={seccion.href}>
            <Link
              href={seccion.href}
              className={`titular px-3 py-2 text-[17px] font-semibold tracking-wide transition-colors hover:text-white ${
                seccion.destacado ? 'text-pelota-suave' : 'text-white/80'
              }`}
            >
              {seccion.etiqueta}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu className="bg-mesa/95 pt-6">
        {SECCIONES.map((seccion) => (
          <NavbarMenuItem key={seccion.href}>
            <Link
              href={seccion.href}
              onClick={() => setMenuAbierto(false)}
              className="titular block py-2 text-2xl text-white"
            >
              {seccion.etiqueta}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
