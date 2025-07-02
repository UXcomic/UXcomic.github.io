import { Component, inject, OnInit } from '@angular/core'
import { MatDialogRef, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Category } from '../../models/category'
import CategoriesData from '../../../../public/data/categoriesAndTags.json'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { Router } from '@angular/router'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-category-list-dialog',
  standalone: true,
  imports: [MatDialogContent, CommonModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './category-list-dialog.html',
  styleUrl: './category-list-dialog.sass',
})
export class CategoryListDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CategoryListDialog>)

  protected selectedCategory?: Category
  protected categories?: Category[]

  protected data: { selectedCategory: Category } = inject(MAT_DIALOG_DATA)

  private router = inject(Router)

  constructor() {}

  ngOnInit(): void {
    this.selectedCategory = this.data?.selectedCategory
    this.categories = CategoriesData
  }

  redirectToCategory(category: Category) {
    const firstTagSlug = category?.tags?.[0]?.slug
    this.router.navigateByUrl(`/blog/${category.slug}/${firstTagSlug}`)
    this.dialogRef.close()
  }
}
