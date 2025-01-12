import { Button } from '@headlessui/react'
import * as React from 'react'

interface IButtonProps {
  id?: string
  databaseId?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const UxComicButton: React.FC<React.PropsWithChildren<IButtonProps>> = ({
  id,
  databaseId,
  onClick,
  children,
}) => {
  return (
    <Button
      id={id}
      data-database-id={databaseId}
      onClick={onClick}
      className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
    >
      {children}
    </Button>
  )
}

export default UxComicButton
