import { Component, inject, Input, OnInit } from '@angular/core'
import { FlowbiteService } from '../../services/flowbite.service'
import { DrawerTopComponent } from '../../components/drawer-top-component/drawer-top-component'
import { Category } from '../../models/category'
import CategoryData from '../../../../public/data/categoriesAndTags.json'
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-section.html',
  styleUrl: './category-section.sass',
})
export class CategorySection {
  @Input() selected?: Category

  protected categories: Category[] = CategoryData.sort((a, b) => a.order - b.order)
  protected config = environment
}
