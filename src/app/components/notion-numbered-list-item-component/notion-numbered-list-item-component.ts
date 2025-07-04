import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'

@Component({
  selector: 'app-notion-numbered-list-item-component',
  standalone: true,
  imports: [CommonModule, NotionTextComponent],
  templateUrl: './notion-numbered-list-item-component.html',
  styleUrl: './notion-numbered-list-item-component.sass',
})
export class NotionNumberedListItemComponent implements OnInit {
  @Input() data?: any
  @Input() index!: number

  ngOnInit(): void {}
}
