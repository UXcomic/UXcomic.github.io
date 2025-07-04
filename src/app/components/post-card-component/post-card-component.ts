import { Component, inject, Input } from '@angular/core'
import { Post } from '../../models/post'
import { environment } from '../../../environments/environment'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'

@Component({
  selector: 'app-post-card-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card-component.html',
  styleUrl: './post-card-component.sass',
})
export class PostCardComponent {
  @Input() post?: Post
  @Input() small?: boolean
  @Input() rotate?: boolean
  @Input() noRedirect?: boolean

  protected config = environment

  private router = inject(Router)

  goToPostDetail() {
    if (this.noRedirect || !this.post) return

    const slug = this.post.slug || 'unknown'
    this.router.navigateByUrl(`/post/${slug}`)
  }
}
