import { Routes } from '@angular/router'
import { Blog } from './pages/blog/blog'
import { Post } from './pages/post/post'
import { NotFound } from './pages/not-found/not-found'
import { About } from './pages/about/about'

export const routes: Routes = [
  {
    path: '',
    component: Blog,
  },
  { path: 'about', component: About },
  { path: 'blog/:category/:tag', component: Blog },
  { path: 'post/:slug', component: Post },
  { path: 'not-found', component: NotFound },
  { path: '**', pathMatch: 'full', component: NotFound },
]
