import { Routes } from '@angular/router'
import { Blog } from './pages/blog/blog'
import { Post } from './pages/post/post'
import { NotFound } from './pages/not-found/not-found'

export const routes: Routes = [
  {
    path: '',
    component: Blog,
  },
  { path: 'blog/:category/:tag', component: Blog },
  { path: 'post/:slug', component: Post },
  { path: '**', pathMatch: 'full', component: NotFound },
]
