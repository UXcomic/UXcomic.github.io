import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import BlogRoutes from '../../../../public/data/blogRoutes.json'
import CategoriesData from '../../../../public/data/categoriesAndTags.json'
import PostsData from '../../../../public/data/posts.json'
import { Category } from '../../models/category'
import { CommonModule } from '@angular/common'
import { CategorySection } from '../../sections/category-section/category-section'
import { TagSection } from '../../sections/tag-section/tag-section'
import { Post } from '../../models/post'
import { convertPost } from '../../utils/post-helper'
import { PostsSection } from '../../sections/posts-section/posts-section'

const DEFAULT_ROUTE = `/blog/${BlogRoutes[0].category}/${BlogRoutes[0].tag}`

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, CategorySection, TagSection, PostsSection],
  templateUrl: './blog.html',
  styleUrl: './blog.sass',
})
export class Blog implements OnInit, OnDestroy {
  protected categoryParam: string | null = null
  protected tagParam: string | null = null
  protected category?: Category
  protected posts?: Post[]

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private paramMapSubscription: Subscription | undefined

  constructor() {}

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      this.categoryParam = params.get('category')
      this.tagParam = params.get('tag')

      if (!this.categoryParam || !this.tagParam) {
        this.router.navigateByUrl(DEFAULT_ROUTE)
        return
      }

      this.category = CategoriesData.find(
        (item) => item.slug === this.categoryParam && item.tags.findIndex((tag) => tag.slug === this.tagParam) > -1,
      )

      this.getPosts()
      this.filterTags()
    })
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) this.paramMapSubscription.unsubscribe()
  }

  private getPosts() {
    const currentTag = this.category?.tags?.find((t) => t.slug === this.tagParam)

    this.posts = (PostsData as any[])
      .filter((p) => p.tag?.slug === currentTag?.slug)
      .sort((a, b) => a.created_time - b.created_time)
      .map((p) => convertPost(p))
  }

  private filterTags() {
    if (!this.category || !this.category.tags) return

    this.category.tags = this.category.tags.filter((t) => (PostsData as any[]).some((p) => p.tag?.slug === t?.slug))
  }
}
