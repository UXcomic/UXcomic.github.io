import { Component, inject, Input, OnInit } from '@angular/core'
import { FlowbiteService } from '../../services/flowbite.service'
import { initFlowbite } from 'flowbite'
import { DrawerTopComponent } from '../../components/drawer-top-component/drawer-top-component'
import { Category } from '../../models/category'
import CategoryData from '../../../../public/data/categoriesAndTags.json'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [DrawerTopComponent, CommonModule],
  templateUrl: './category-section.html',
  styleUrl: './category-section.sass',
})
export class CategorySection implements OnInit {
  @Input() selected?: Category

  protected categories: Category[] = CategoryData

  private flowbiteService = inject(FlowbiteService)

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite()
    })
  }
}
