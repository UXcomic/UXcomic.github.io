import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import BlogRoutes from '../../../../public/data/blogRoutes.json'
import PostData from '../../../../public/data/posts.json'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { slugify } from '../../utils/string-helper'
import { PostCardComponent } from '../../components/post-card-component/post-card-component'
import { CommonModule } from '@angular/common'
import { PostContent } from '../../models/post-content'
import { convertPostContent } from '../../utils/post-helper'
import { PostContentSection } from '../../sections/post-content-section/post-content-section'

const DEFAULT_ROUTE = `/blog/${BlogRoutes[0].category}/${BlogRoutes[0].tag}`

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [PostCardComponent, CommonModule, PostContentSection],
  templateUrl: './post.html',
  styleUrl: './post.sass',
})
export class Post implements OnInit, OnDestroy {
  protected post?: PostContent

  private slugParam: string | null = null

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private paramMapSubscription: Subscription | undefined

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      this.slugParam = params.get('slug')

      if (!this.slugParam) {
        this.router.navigateByUrl(DEFAULT_ROUTE)
        return
      }

      const pData = (PostData as any[]).find(
        (p) => slugify(p?.properties?.Name?.title?.[0]?.text?.content) === this.slugParam,
      )
      this.post = convertPostContent(pData)
    })
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) this.paramMapSubscription.unsubscribe()
  }

  goBack() {
    this.router.navigateByUrl(`/blog/${this.post?.category?.slug}/${this.post?.tag?.slug}`)
  }
}
