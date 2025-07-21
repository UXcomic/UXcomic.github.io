import { Component, inject, Input, OnInit } from '@angular/core'
import { Post } from '../../models/post'
import { environment } from '../../../environments/environment'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { CloudinaryModule } from '@cloudinary/ng'
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'

@Component({
  selector: 'app-post-card-component',
  standalone: true,
  imports: [CommonModule, CloudinaryModule],
  templateUrl: './post-card-component.html',
  styleUrl: './post-card-component.sass',
})
export class PostCardComponent implements OnInit {
  @Input() post?: Post
  @Input() small?: boolean
  @Input() rotate?: boolean
  @Input() noRedirect?: boolean

  protected isImageLoaded: boolean = false
  protected config = environment
  protected coverUrl?: string

  private router = inject(Router)
  private cld?: Cloudinary

  ngOnInit(): void {
    this.cld = new Cloudinary({
      cloud: {
        cloudName: this.config.cloudinaryCloudName,
      },
    })

    const publicId = this.post?.cover?.public_id
    if (this.post && publicId) {
      this.coverUrl = this.cld.image(publicId).resize(fill().width(200).height(200)).toURL()
    }
  }

  goToPostDetail() {
    if (this.noRedirect || !this.post) return

    const slug = this.post.slug || 'unknown'
    this.router.navigateByUrl(`/post/${slug}`)
  }
}
