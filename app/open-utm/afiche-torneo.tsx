'use client'

import { Modal, ModalBody, ModalContent, useDisclosure } from '@heroui/react'
import Image from 'next/image'

const AFICHE = '/open-internacional-copa-utm-2026.jpeg'

export function AficheTorneo() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        aria-label="Ampliar el afiche del torneo"
        className="group relative mx-auto block w-full max-w-sm cursor-zoom-in rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-pelota-suave"
      >
        <Image
          src={AFICHE}
          alt="Afiche del I Open Internacional Copa UTM 2026"
          width={1254}
          height={1254}
          priority
          className="w-full rounded-2xl shadow-2xl transition group-hover:brightness-110"
        />
        <span className="epigrafe pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-mesa/80 px-4 py-1.5 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
          Toca para ampliar
        </span>
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
        classNames={{ body: 'p-2 sm:p-4' }}
      >
        <ModalContent>
          {() => (
            <ModalBody>
              <Image
                src={AFICHE}
                alt="Afiche del I Open Internacional Copa UTM 2026"
                width={1254}
                height={1254}
                className="h-auto w-full rounded-xl"
              />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}