import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'

@Component({
  selector: 'app-notion-carousel-component',
  imports: [CommonModule, NotionTextComponent],
  templateUrl: './notion-carousel-component.html',
  styleUrl: './notion-carousel-component.sass',
})
export class NotionCarouselComponent {
  @Input() data?: any
}
