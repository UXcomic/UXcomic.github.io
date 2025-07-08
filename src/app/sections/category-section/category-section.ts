import { Component, inject, Input, OnInit } from '@angular/core'
import { FlowbiteService } from '../../services/flowbite.service'
import { DrawerTopComponent } from '../../components/drawer-top-component/drawer-top-component'
import { Category } from '../../models/category'
import CategoryData from '../../../../public/data/categoriesAndTags.json'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { initFlowbite } from 'flowbite'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [DrawerTopComponent, CommonModule],
  templateUrl: './category-section.html',
  styleUrl: './category-section.sass',
})
export class CategorySection implements OnInit {
  @Input() selected?: Category

  protected categories: Category[] = CategoryData.sort((a, b) => a.order - b.order)
  protected config = environment

  private flowbiteService = inject(FlowbiteService)
  private router = inject(Router)

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite()
    })
  }

  goToCategory(category: Category) {
    if (!category) return

    const firstTagSlug = category.tags?.[0]?.slug || 'null'
    this.router.navigateByUrl(`/blog/${category.slug}/${firstTagSlug}`)
  }

  goToAbout() {
    this.router.navigateByUrl('/about')
  }
}
