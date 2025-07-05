import { RenderMode, ServerRoute } from '@angular/ssr'
import BlogRoutes from '../../public/data/blogRoutes.json'
import PostRoutes from '../../public/data/postRoutes.json'

export const serverRoutes: ServerRoute[] = [
  { path: 'about', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:category/:tag',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return BlogRoutes.map(({ category, tag }) => ({ category, tag }))
    },
  },
  {
    path: 'post/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return PostRoutes.map(({ slug }) => ({ slug }))
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
]
