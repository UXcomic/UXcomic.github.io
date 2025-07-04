import { Component, Input } from '@angular/core'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'

@Component({
  selector: 'app-notion-paragraph-component',
  standalone: true,
  imports: [NotionTextComponent],
  templateUrl: './notion-paragraph-component.html',
  styleUrl: './notion-paragraph-component.sass',
})
export class NotionParagraphComponent {
  @Input() data?: any
}
