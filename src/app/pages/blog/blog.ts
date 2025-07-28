import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import CategoriesData from '../../../../public/data/categoriesAndTags.json'
import PostsData from '../../../../public/data/posts.json'
import { Category } from '../../models/category'
import { CommonModule } from '@angular/common'
import { CategorySection } from '../../sections/category-section/category-section'
import { TagSection } from '../../sections/tag-section/tag-section'
import { Post } from '../../models/post'
import { convertPost } from '../../utils/post-helper'
import { PostsSection } from '../../sections/posts-section/posts-section'
import { DrawerTopComponent } from '../../components/drawer-top-component/drawer-top-component'
import { getNotFoundRoute } from '../../utils/route-helper'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, CategorySection, TagSection, PostsSection, DrawerTopComponent, RouterModule],
  templateUrl: './blog.html',
  styleUrl: './blog.sass',
})
export class Blog implements OnInit, OnDestroy {
  protected categoryParam: string | null = null
  protected tagParam: string | null = null
  protected category?: Category
  protected categories?: Category[] = CategoriesData
  protected posts?: Post[]
  protected config = environment

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private paramMapSubscription: Subscription | undefined

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      this.categoryParam = params.get('category')
      this.tagParam = params.get('tag')

      if (!this.categoryParam || !this.tagParam) {
        this.categoryParam = this.config.defaultCategory
        this.tagParam = this.config.defaultTag
      }

      this.category = CategoriesData.find(
        (item) => item.slug === this.categoryParam && item.tags.findIndex((tag) => tag.slug === this.tagParam) > -1,
      )

      if (!this.category) {
        this.router.navigateByUrl(getNotFoundRoute())
        return
      }

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
      .filter((p) => p.category?.slug === this.category?.slug && p.tag?.slug === currentTag?.slug)
      .sort((a, b) => a.created_time - b.created_time)
      .map((p) => convertPost(p))
  }

  private filterTags() {
    if (!this.category || !this.category.tags) return

    this.category.tags = this.category.tags.filter((t) => (PostsData as any[]).some((p) => p.tag?.slug === t?.slug))
  }
}
