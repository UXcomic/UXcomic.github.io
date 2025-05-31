import React, { useState } from 'react'
import { AboutDialog } from './common'

interface IAboutSectionProps {}

const AboutSection: React.FC<
  React.PropsWithChildren<IAboutSectionProps>
> = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const handleGoToAboutPage = () => {
    setOpenDialog((state) => !state)
  }

  return (
    <>
      <div className="h-11 pt-1">
        <p
          className="font-uxcomic-manrope-regular text-center text-uxcomic-footer"
          onClick={handleGoToAboutPage}
        >
          <span className="text-uxcomic-text-tertiary">Built with</span>
          <span> ❤️ </span>
          <span className="text-uxcomic-text-tertiary"> by </span>
          <b className="text-uxcomic-text-tertiary underline underline-offset-1">
            UXcomic
          </b>
        </p>
      </div>
      <AboutDialog openDialog={openDialog} onOpenDialog={setOpenDialog} />
    </>
  )
}

export default AboutSection
