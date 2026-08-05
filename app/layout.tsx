import type { Metadata } from 'next'
import { Barlow_Condensed, Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--fuente-display',
})

const texto = Inter({
  subsets: ['latin'],
  variable: '--fuente-texto',
})

export const metadata: Metadata = {
  title: 'Club UTM · Unidos por el Tenis de Mesa',
  description:
    'Club de tenis de mesa con sedes en Jesús María y Magdalena del Mar, Lima. Escuela de menores, competencia federada y torneos internacionales.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITIO_URL ?? 'https://www.clubutm.com'),
  openGraph: {
    title: 'Club UTM · Unidos por el Tenis de Mesa',
    description: 'Escuela, competencia y comunidad de tenis de mesa en Lima, Perú.',
    images: ['/logo-utm.jpeg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${texto.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
