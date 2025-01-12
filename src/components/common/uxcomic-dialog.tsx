import * as React from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface IDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
  closeCallback?: () => void
}

const UxComicDialog: React.FC<React.PropsWithChildren<IDialogProps>> = ({
  open,
  setOpen,
  closeCallback,
  children,
}) => {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative w-full h-dvh overflow-y-auto overflow-x-hidden px-4 pb-20 shadow-2xl bg-uxcomic-bg">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  closeCallback && closeCallback()
                }}
                className="fixed right-4 top-4 flex items-center justify-center w-12 h-12 rounded-full bg-white backdrop-blur-lg bg-opacity-75 border-2 border-solid border-white z-50"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
              {children}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default UxComicDialog
