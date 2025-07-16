import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-notion-carousel-component',
  imports: [CommonModule],
  templateUrl: './notion-carousel-component.html',
  styleUrl: './notion-carousel-component.sass',
})
export class NotionCarouselComponent {
  @Input() data?: any
}
