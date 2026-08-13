'use client'

import { Button, Card, CardBody, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CLAVE_PUBLICACIONES, publicar, subirArchivo, TAMANO_MAXIMO_ARCHIVO } from '@/lib/api'
import type { TipoPublicacion } from '@/lib/tipos'

const FORMATOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp']
const MB = 1024 * 1024

export function FormularioPublicacion() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const campoArchivo = useRef<HTMLInputElement>(null)
  const campoPortada = useRef<HTMLInputElement>(null)
  const [errorArchivo, setErrorArchivo] = useState('')
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (vistaPrevia) URL.revokeObjectURL(vistaPrevia)
    }
  }, [vistaPrevia])

  function limpiarArchivos() {
    if (campoArchivo.current) campoArchivo.current.value = ''
    if (campoPortada.current) campoPortada.current.value = ''
    setVistaPrevia(null)
    setErrorArchivo('')
  }

  function alElegirPortada() {
    const imagen = campoPortada.current?.files?.[0]
    setVistaPrevia(imagen ? URL.createObjectURL(imagen) : null)
  }

  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationFn: async (valores: {
      datos: Record<string, string | null>
      bases?: File
      portada?: File
    }) => {
      const [basesUrl, imagenUrl] = await Promise.all([
        valores.bases ? subirArchivo(valores.bases, 'bases') : Promise.resolve(null),
        valores.portada ? subirArchivo(valores.portada, 'portadas') : Promise.resolve(null),
      ])

      return publicar({
        ...valores.datos,
        basesUrl: basesUrl ?? valores.datos.enlaceBases ?? null,
        imagenUrl,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE_PUBLICACIONES })
      router.refresh()
    },
  })

  const form = useForm({
    defaultValues: {
      tipo: 'torneo' as TipoPublicacion,
      titulo: '',
      fecha: '',
      sede: '',
      resumen: '',
      enlaceBases: '',
    },
    onSubmit: async ({ value, formApi }) => {
      const archivo = campoArchivo.current?.files?.[0]
      const portada = campoPortada.current?.files?.[0]

      if (archivo && archivo.type !== 'application/pdf') {
        setErrorArchivo('Las bases deben estar en formato PDF.')
        return
      }
      if (portada && !FORMATOS_IMAGEN.includes(portada.type)) {
        setErrorArchivo('La portada debe ser JPG, PNG o WebP.')
        return
      }
      for (const candidato of [archivo, portada]) {
        if (candidato && candidato.size > TAMANO_MAXIMO_ARCHIVO) {
          setErrorArchivo(
            `"${candidato.name}" pesa ${(candidato.size / MB).toFixed(1)} MB y el máximo es 8 MB.`,
          )
          return
        }
      }

      setErrorArchivo('')
      await mutateAsync({ datos: { ...value }, bases: archivo, portada })
      formApi.reset()
      limpiarArchivos()
    },
  })

  return (
    <Card shadow="none" className="h-fit border-2 border-pelota">
      <CardBody className="gap-4 p-7">
        <h2 className="titular text-2xl font-semibold">Publicar</h2>

        <form.Field
          name="titulo"
          validators={{ onSubmit: ({ value }) => (value.trim() ? undefined : 'Escribe un título.') }}
        >
          {(field) => (
            <Input
              label="Título"
              placeholder="I Open Internacional Copa UTM 2026"
              value={field.state.value}
              onValueChange={field.handleChange}
              isInvalid={field.state.meta.errors.length > 0}
              errorMessage={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <div className="grid grid-cols-2 gap-3">
          <form.Field name="tipo">
            {(field) => (
              <Select
                label="Tipo"
                selectedKeys={[field.state.value]}
                onSelectionChange={(claves) =>
                  field.handleChange([...claves][0] as TipoPublicacion)
                }
              >
                <SelectItem key="torneo">Torneo</SelectItem>
                <SelectItem key="noticia">Noticia</SelectItem>
              </Select>
            )}
          </form.Field>

          <form.Field
            name="fecha"
            validators={{ onSubmit: ({ value }) => (value ? undefined : 'Indica la fecha.') }}
          >
            {(field) => (
              <Input
                type="date"
                label="Fecha"
                value={field.state.value}
                onValueChange={field.handleChange}
                isInvalid={field.state.meta.errors.length > 0}
                errorMessage={field.state.meta.errors[0]}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="sede">
          {(field) => (
            <Input
              label="Sede o lugar"
              placeholder="Coliseo del Club Lawn Tennis de la Exposición"
              value={field.state.value}
              onValueChange={field.handleChange}
            />
          )}
        </form.Field>

        <form.Field
          name="resumen"
          validators={{
            onSubmit: ({ value }) => (value.trim() ? undefined : 'Escribe una descripción.'),
          }}
        >
          {(field) => (
            <Textarea
              label="Descripción"
              placeholder="Categorías, horario de acreditación, costo de inscripción..."
              minRows={4}
              value={field.state.value}
              onValueChange={field.handleChange}
              isInvalid={field.state.meta.errors.length > 0}
              errorMessage={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <div>
          <label className="epigrafe mb-2 block text-xs text-default-500" htmlFor="portada">
            Imagen de portada (opcional)
          </label>
          <input
            id="portada"
            ref={campoPortada}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={alElegirPortada}
            className="w-full rounded-xl border border-default-200 bg-default-100 p-3 text-sm"
          />
          <p className="mt-1 text-xs text-default-400">
            JPG, PNG o WebP, hasta 8 MB. Se muestra en la tarjeta del evento.
          </p>
          {vistaPrevia && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={vistaPrevia}
              alt="Vista previa de la portada"
              className="mt-3 h-40 w-full rounded-xl border border-default-200 object-cover"
            />
          )}
        </div>

        <div>
          <label className="epigrafe mb-2 block text-xs text-default-500" htmlFor="bases">
            Bases en PDF (opcional)
          </label>
          <input
            id="bases"
            ref={campoArchivo}
            type="file"
            accept="application/pdf"
            className="w-full rounded-xl border border-default-200 bg-default-100 p-3 text-sm"
          />
          <p className="mt-1 text-xs text-default-400">PDF, hasta 8 MB.</p>
          {errorArchivo && <p className="mt-1 text-sm text-danger">{errorArchivo}</p>}
        </div>

        <form.Field name="enlaceBases">
          {(field) => (
            <Input
              label="O enlace externo a las bases"
              placeholder="https://drive.google.com/..."
              value={field.state.value}
              onValueChange={field.handleChange}
            />
          )}
        </form.Field>

        <Button color="primary" radius="full" isLoading={isPending} onPress={() => form.handleSubmit()}>
          {isPending ? 'Subiendo…' : 'Publicar'}
        </Button>

        {error && <p className="text-sm text-danger">{error.message}</p>}
        {isSuccess && !isPending && <p className="text-sm text-success">Publicado.</p>}
      </CardBody>
    </Card>
  )
}
