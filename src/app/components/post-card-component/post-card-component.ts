import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { Post } from '../../models/post'
import { environment } from '../../../environments/environment'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { CloudinaryModule, placeholder } from '@cloudinary/ng'
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { quality } from '@cloudinary/url-gen/actions/delivery'
import { auto } from '@cloudinary/url-gen/qualifiers/quality'

@Component({
  selector: 'app-post-card-component',
  standalone: true,
  imports: [CommonModule, CloudinaryModule],
  templateUrl: './post-card-component.html',
  styleUrl: './post-card-component.sass',
})
export class PostCardComponent implements OnInit, OnChanges {
  @Input() post?: Post
  @Input() small?: boolean
  @Input() rotate?: boolean
  @Input() noRedirect?: boolean

  protected isImageLoaded: boolean = false
  protected config = environment
  protected coverImg!: CloudinaryImage
  protected coverImgPlugins = [placeholder({ mode: 'blur' })]

  private router = inject(Router)
  private cld?: Cloudinary

  ngOnInit(): void {
    this.cld = new Cloudinary({
      cloud: {
        cloudName: this.config.cloudinaryCloudName,
      },
    })

    this.setCoverUrl()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.post = changes['post'].currentValue
    this.setCoverUrl()
  }

  setCoverUrl() {
    if (this.post && this.cld)
      this.coverImg = this.cld
        .image(this.post.cover?.public_id)
        .resize(fill().width(300).height(300))
        .delivery(quality(auto()))
  }

  goToPostDetail() {
    if (this.noRedirect || !this.post) return

    const slug = this.post.slug || 'unknown'
    this.router.navigateByUrl(`/post/${slug}`)
  }
}
