import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import React from 'react'

interface IUxComicDrawerProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const UxComicDrawer: React.FC<React.PropsWithChildren<IUxComicDrawerProps>> = ({
  open,
  setOpen,
  children,
}) => {
  return (
    <Dialog open={open} onClose={setOpen}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="pointer-events-none fixed top-0 flex max-w-full"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:-translate-y-96 sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-uxcomic-bg shadow-xl rounded-b-[24px]">
                <div className="relative flex-1 pl-6 pr-4 pb-3">{children}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default UxComicDrawer
