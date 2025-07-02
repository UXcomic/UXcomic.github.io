import { Component, inject, Input, OnInit } from '@angular/core'
import { Category } from '../../models/category'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { CategoryListDialog } from '../category-list-dialog/category-list-dialog'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.sass',
})
export class Header implements OnInit {
  @Input() category?: Category

  readonly dialog = inject(MatDialog)

  openDialog() {
    this.dialog.open(CategoryListDialog, {
      width: '100%',
      maxWidth: '100vw',
      panelClass: 'ux__category-list-dialog-container',
      position: {
        top: '0',
      },
      data: { selectedCategory: this.category },
    })
  }

  ngOnInit(): void {}
}
