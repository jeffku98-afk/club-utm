'use client'

import { Button, Card, CardBody, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { CLAVE_PUBLICACIONES, publicar } from '@/lib/api'
import type { TipoPublicacion } from '@/lib/tipos'

const TAMANO_MAXIMO = 4 * 1024 * 1024

export function FormularioPublicacion() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const campoArchivo = useRef<HTMLInputElement>(null)
  const [errorArchivo, setErrorArchivo] = useState('')

  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationFn: publicar,
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
      if (archivo && archivo.size > TAMANO_MAXIMO) {
        setErrorArchivo('El PDF supera los 4 MB. Súbelo a Drive y pega el enlace.')
        return
      }

      const datos = new FormData()
      Object.entries(value).forEach(([campo, valor]) => datos.append(campo, valor))
      if (archivo) datos.append('bases', archivo)

      await mutateAsync(datos)
      formApi.reset()
      if (campoArchivo.current) campoArchivo.current.value = ''
      setErrorArchivo('')
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
          <label className="epigrafe mb-2 block text-xs text-default-500" htmlFor="bases">
            Bases en PDF
          </label>
          <input
            id="bases"
            ref={campoArchivo}
            type="file"
            accept="application/pdf"
            className="w-full rounded-xl border border-default-200 bg-default-100 p-3 text-sm"
          />
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
          Publicar
        </Button>

        {error && <p className="text-sm text-danger">{error.message}</p>}
        {isSuccess && !isPending && <p className="text-sm text-success">Publicado.</p>}
      </CardBody>
    </Card>
  )
}
