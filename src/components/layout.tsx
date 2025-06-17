import * as React from 'react'
import { CategoryManager, PostManager, TagManager } from './manager'
import UXComicPage from '../pages/[...]'
import { Router } from '@reach/router'

interface ILayoutProps {}

const Layout: React.FC<React.PropsWithChildren<ILayoutProps>> = ({
  children,
}) => {
  return (
    <>
      <CategoryManager />
      <TagManager />
      <PostManager />

      <div className="container mx-auto h-dvh w-screen bg-uxcomic-bg">
        <main className="flex flex-col h-dvh overflow-x-hidden max-w-96 mx-auto">
          {children || 'No Content'}
        </main>
      </div>
    </>
  )
}

export default Layout
