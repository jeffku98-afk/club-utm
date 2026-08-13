'use client'

import { Button, Card, CardBody, Input } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import {
  CLAVE_TORNEO,
  eliminarDocumentoTorneoCliente,
  guardarTorneo,
  obtenerTorneoCliente,
  subirArchivo,
  TAMANO_MAXIMO_ARCHIVO,
} from '@/lib/api'
import {
  SECCIONES_TORNEO,
  type FormatoDocumento,
  type SeccionTorneo,
  type Torneo,
} from '@/lib/tipos'

const FORMATOS: Record<string, FormatoDocumento> = {
  'application/pdf': 'pdf',
  'application/vnd.ms-excel': 'excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
}

const MB = 1024 * 1024

export function GestionTorneo({ inicial }: { inicial: Torneo }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [galeria, setGaleria] = useState(inicial.galeriaUrl ?? '')
  const [aviso, setAviso] = useState('')

  const { data: torneo = inicial } = useQuery({
    queryKey: CLAVE_TORNEO,
    queryFn: obtenerTorneoCliente,
    initialData: inicial,
  })

  function refrescar() {
    queryClient.invalidateQueries({ queryKey: CLAVE_TORNEO })
    router.refresh()
  }

  const subir = useMutation({
    mutationFn: async ({ seccion, archivo }: { seccion: SeccionTorneo; archivo: File }) => {
      const formato = FORMATOS[archivo.type]
      if (!formato) throw new Error('El archivo debe ser PDF o Excel.')
      if (archivo.size > TAMANO_MAXIMO_ARCHIVO) {
        throw new Error(
          `"${archivo.name}" pesa ${(archivo.size / MB).toFixed(1)} MB y el máximo es 8 MB.`,
        )
      }

      const url = await subirArchivo(archivo, `torneo/${seccion}`)
      return guardarTorneo({ seccion, nombre: archivo.name, url, formato })
    },
    onSuccess: refrescar,
  })

  const quitar = useMutation({
    mutationFn: eliminarDocumentoTorneoCliente,
    onSuccess: refrescar,
  })

  const guardarGaleria = useMutation({
    mutationFn: (galeriaUrl: string) => guardarTorneo({ galeriaUrl }),
    onSuccess: () => {
      setAviso('Enlace guardado.')
      refrescar()
      setTimeout(() => setAviso(''), 4000)
    },
  })

  return (
    <Card shadow="none" className="border-2 border-azul">
      <CardBody className="gap-5 p-7">
        <div>
          <h2 className="titular text-2xl font-semibold">Open Internacional Copa UTM 2026</h2>
          <p className="text-sm text-default-500">
            Sube el PDF o Excel de cada sección, hasta 8 MB. Al reemplazar un archivo, el anterior
            se elimina.
          </p>
        </div>

        {subir.error && <p className="text-sm text-danger">{subir.error.message}</p>}
        {quitar.error && <p className="text-sm text-danger">{quitar.error.message}</p>}

        <ul className="divide-y divide-default-200">
          {SECCIONES_TORNEO.map((seccion) => (
            <FilaSeccion
              key={seccion.clave}
              clave={seccion.clave}
              titulo={seccion.titulo}
              nombreArchivo={torneo.documentos[seccion.clave]?.nombre ?? null}
              urlArchivo={torneo.documentos[seccion.clave]?.url ?? null}
              subiendo={subir.isPending && subir.variables?.seccion === seccion.clave}
              onSubir={(archivo) => subir.mutate({ seccion: seccion.clave, archivo })}
              onQuitar={() => quitar.mutate(seccion.clave)}
            />
          ))}
        </ul>

        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="Galería de fotos (Google Drive)"
            placeholder="https://drive.google.com/drive/folders/..."
            value={galeria}
            onValueChange={setGaleria}
            className="min-w-[260px] flex-1"
          />
          <Button
            color="secondary"
            radius="full"
            isLoading={guardarGaleria.isPending}
            onPress={() => guardarGaleria.mutate(galeria.trim())}
            className="titular tracking-wider"
          >
            Guardar enlace
          </Button>
        </div>
        {aviso && <p className="text-sm text-success">{aviso}</p>}
      </CardBody>
    </Card>
  )
}

function FilaSeccion({
  clave,
  titulo,
  nombreArchivo,
  urlArchivo,
  subiendo,
  onSubir,
  onQuitar,
}: {
  clave: SeccionTorneo
  titulo: string
  nombreArchivo: string | null
  urlArchivo: string | null
  subiendo: boolean
  onSubir: (archivo: File) => void
  onQuitar: () => void
}) {
  const campo = useRef<HTMLInputElement>(null)

  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      <div className="min-w-[180px] flex-1">
        <p className="titular text-lg tracking-wide">{titulo}</p>
        {nombreArchivo ? (
          <a
            href={urlArchivo ?? '#'}
            target="_blank"
            rel="noopener"
            className="text-xs text-azul underline underline-offset-4"
          >
            {nombreArchivo}
          </a>
        ) : (
          <span className="text-xs text-default-400">Sin archivo</span>
        )}
      </div>

      <input
        id={`archivo-${clave}`}
        ref={campo}
        type="file"
        accept="application/pdf,.xls,.xlsx"
        className="hidden"
        onChange={(evento) => {
          const archivo = evento.target.files?.[0]
          if (archivo) onSubir(archivo)
          evento.target.value = ''
        }}
      />

      <Button
        size="sm"
        radius="full"
        variant="bordered"
        isLoading={subiendo}
        onPress={() => campo.current?.click()}
        className="titular tracking-wider"
      >
        {nombreArchivo ? 'Reemplazar' : 'Subir'}
      </Button>

      {nombreArchivo && (
        <Button
          size="sm"
          radius="full"
          color="danger"
          variant="light"
          onPress={onQuitar}
          className="titular tracking-wider"
        >
          Quitar
        </Button>
      )}
    </li>
  )
}
