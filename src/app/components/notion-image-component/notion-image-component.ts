import { Component, Input } from '@angular/core'
import { environment } from '../../../environments/environment'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'

@Component({
  selector: 'app-notion-image-component',
  standalone: true,
  imports: [NotionTextComponent],
  templateUrl: './notion-image-component.html',
  styleUrl: './notion-image-component.sass',
})
export class NotionImageComponent {
  @Input() data?: any

  protected config = environment
}
