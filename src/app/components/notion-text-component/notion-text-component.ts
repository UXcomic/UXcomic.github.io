import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-notion-text-component',
  standalone: true,
  imports: [],
  templateUrl: './notion-text-component.html',
  styleUrl: './notion-text-component.sass',
})
export class NotionTextComponent {
  @Input() data?: any
}
