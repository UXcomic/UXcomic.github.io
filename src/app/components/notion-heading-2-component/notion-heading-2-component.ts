import { Component, Input } from '@angular/core'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'

@Component({
  selector: 'app-notion-heading-2-component',
  standalone: true,
  imports: [NotionTextComponent],
  templateUrl: './notion-heading-2-component.html',
  styleUrl: './notion-heading-2-component.sass',
})
export class NotionHeading2Component {
  @Input() data?: any
}
