declare module 'html-react-parser' {
  import { ReactNode } from 'react'

  interface Element {
    type: string
    name: string
    attribs: { [key: string]: string }
    children: Element[]
  }

  export default function parse(
    html: string,
    options?: {
      replace?: (domNode: Element | Text) => void
    }
  ): ReactNode
  export { Element }
}
