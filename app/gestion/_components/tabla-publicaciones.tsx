'use client'

import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CLAVE_PUBLICACIONES, eliminar, fechaLarga, obtenerPublicaciones } from '@/lib/api'
import type { Publicacion } from '@/lib/tipos'

const columna = createColumnHelper<Publicacion>()

export function TablaPublicaciones({ iniciales }: { iniciales: Publicacion[] }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: publicaciones = [] } = useQuery({
    queryKey: CLAVE_PUBLICACIONES,
    queryFn: obtenerPublicaciones,
    initialData: iniciales,
  })

  const { mutate: borrar, isPending, variables } = useMutation({
    mutationFn: eliminar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE_PUBLICACIONES })
      router.refresh()
    },
  })

  const columnas = [
    columna.accessor('titulo', {
      header: 'Publicación',
      cell: (celda) => (
        <div className="flex items-center gap-3">
          {celda.row.original.imagenUrl ? (
            <Image
              src={celda.row.original.imagenUrl}
              alt=""
              width={80}
              height={56}
              className="h-14 w-20 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="h-14 w-20 shrink-0 rounded-lg bg-default-100" />
          )}
          <div>
            <p className="font-semibold">{celda.getValue()}</p>
            <p className="text-xs text-default-500">{fechaLarga(celda.row.original.fecha)}</p>
          </div>
        </div>
      ),
    }),
    columna.accessor('tipo', {
      header: 'Tipo',
      cell: (celda) => (
        <Chip
          size="sm"
          radius="full"
          className={`titular tracking-widest text-white ${
            celda.getValue() === 'noticia' ? 'bg-azul' : 'bg-pelota'
          }`}
        >
          {celda.getValue() === 'noticia' ? 'Noticia' : 'Torneo'}
        </Chip>
      ),
    }),
    columna.accessor('basesUrl', {
      header: 'Bases',
      cell: (celda) =>
        celda.getValue() ? (
          <a
            href={celda.getValue() as string}
            target="_blank"
            rel="noopener"
            className="text-azul underline underline-offset-4"
          >
            Ver PDF
          </a>
        ) : (
          <span className="text-default-400">—</span>
        ),
    }),
    columna.display({
      id: 'acciones',
      header: '',
      cell: (celda) => (
        <Button
          size="sm"
          radius="full"
          color="danger"
          variant="light"
          isLoading={isPending && variables === celda.row.original.id}
          onPress={() => borrar(celda.row.original.id)}
        >
          Eliminar
        </Button>
      ),
    }),
  ]

  const tabla = useReactTable({
    data: publicaciones,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table aria-label="Publicaciones del club" removeWrapper isHeaderSticky>
      <TableHeader>
        {tabla.getHeaderGroups()[0].headers.map((encabezado) => (
          <TableColumn key={encabezado.id}>
            {flexRender(encabezado.column.columnDef.header, encabezado.getContext())}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent="Aún no hay publicaciones.">
        {tabla.getRowModel().rows.map((fila) => (
          <TableRow key={fila.id}>
            {fila.getVisibleCells().map((celda) => (
              <TableCell key={celda.id}>
                {flexRender(celda.column.columnDef.cell, celda.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
