import { Component, Input } from '@angular/core'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'

@Component({
  selector: 'app-notion-heading-1-component',
  imports: [NotionTextComponent],
  templateUrl: './notion-heading-1-component.html',
  styleUrl: './notion-heading-1-component.sass',
})
export class NotionHeading1Component {
  @Input() data?: any
}
