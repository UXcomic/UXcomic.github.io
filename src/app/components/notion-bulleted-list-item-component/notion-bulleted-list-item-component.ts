import { Component, Input } from '@angular/core'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-notion-bulleted-list-item-component',
  standalone: true,
  imports: [NotionTextComponent, CommonModule],
  templateUrl: './notion-bulleted-list-item-component.html',
  styleUrl: './notion-bulleted-list-item-component.sass',
})
export class NotionBulletedListItemComponent {
  @Input() data?: any
}
