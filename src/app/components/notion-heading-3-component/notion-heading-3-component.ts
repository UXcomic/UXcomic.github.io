import { Component, Input } from '@angular/core'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'

@Component({
  selector: 'app-notion-heading-3-component',
  imports: [NotionTextComponent],
  templateUrl: './notion-heading-3-component.html',
  styleUrl: './notion-heading-3-component.sass',
})
export class NotionHeading3Component {
  @Input() data?: any
}
