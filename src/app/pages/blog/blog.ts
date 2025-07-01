import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import BlogRoutes from '../../../../public/data/blogRoutes.json'
import CategoriesData from '../../../../public/data/categoriesAndTags.json'
import { Header } from '../../components/header/header'
import { Category } from '../../models/category'

const DEFAULT_ROUTE = `/blog/${BlogRoutes[0].category}/${BlogRoutes[0].tag}`

@Component({
  selector: 'app-blog',
  imports: [Header],
  templateUrl: './blog.html',
  styleUrl: './blog.sass',
})
export class Blog implements OnInit, OnDestroy {
  protected categoryParam: string | null = null
  protected tagParam: string | null = null
  protected category?: Category

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private paramMapSubscription: Subscription | undefined

  constructor() {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      this.categoryParam = params.get('category')
      this.tagParam = params.get('tag')

      if (!this.categoryParam || !this.tagParam) {
        this.router.navigateByUrl(DEFAULT_ROUTE)
        return
      }
    })
  }

  ngOnInit(): void {
    this.category = CategoriesData.find(
      (item) => item.slug === this.categoryParam && item.tags.findIndex((tag) => tag.slug === this.tagParam) > -1,
    )
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) this.paramMapSubscription.unsubscribe()
  }
}
