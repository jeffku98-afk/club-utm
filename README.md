# Club UTM · Unidos por el Tenis de Mesa

Sitio del club en Next.js (App Router) + HeroUI + TanStack Query / Table / Form, en TypeScript.

## Puesta en marcha

```bash
npm install
cp .env.local.example .env.local   # define ADMIN_PASSWORD y SESSION_SECRET
npm run dev
```

## Estructura

```
app/
├── page.tsx                     Página pública (Server Component)
├── _components/                 Portada, misión/visión, prensa, galería, publicaciones, sedes
├── acceso/                      Ingreso al área interna (sin enlace en la web pública)
├── gestion/                     Panel de publicación, protegido por middleware
└── api/
    ├── auth/route.ts            Inicio y cierre de sesión
    └── publicaciones/           GET público · POST y DELETE con sesión
lib/
├── almacen.ts                   Persistencia (JSON + PDFs en public/bases)
├── sesion.ts                    Cookie httpOnly firmada con HMAC-SHA256
├── api.ts                       Cliente de TanStack Query
└── tipos.ts
middleware.ts                    Protege /gestion
```

## Acceso de administrador

No hay botón de acceso en la página pública. El administrador entra por `/acceso`, que valida
`ADMIN_PASSWORD` y emite una cookie `httpOnly` firmada con HMAC-SHA256 y vigencia de 8 horas.
El middleware protege `/gestion` y los route handlers de escritura vuelven a verificar la sesión,
así que la protección no depende del navegador. Ambas rutas están marcadas `noindex`.

## Persistencia

`lib/almacen.ts` guarda las publicaciones en `data/publicaciones.json` y las bases en
`public/bases/`. Funciona en un VPS, contenedor o Node self-hosted con disco persistente.
En plataformas serverless (Vercel, Netlify) el sistema de archivos es efímero: reemplaza las
cuatro funciones de ese archivo por una lista de SharePoint, Supabase o similar. El resto del
código no cambia.

## Despliegue en Vercel con Vercel Blob

`lib/almacen.blob.ts` es la versión del almacén para hosting serverless: guarda el índice de
publicaciones y los PDFs en Vercel Blob en vez del sistema de archivos local.

1. Crea el store en Vercel: **Storage → Create → Blob**. Vercel agrega `BLOB_READ_WRITE_TOKEN`
   al proyecto automáticamente.
2. Reemplaza el almacén:
   ```bash
   mv lib/almacen.ts lib/almacen.local.ts
   mv lib/almacen.blob.ts lib/almacen.ts
   ```
3. Define en el proyecto de Vercel las variables `ADMIN_PASSWORD` y `SESSION_SECRET`.

El PDF viaja por el route handler, así que aplica el límite de 4.5 MB de body de las Vercel
Functions. El formulario ya rechaza archivos mayores antes de enviarlos.
