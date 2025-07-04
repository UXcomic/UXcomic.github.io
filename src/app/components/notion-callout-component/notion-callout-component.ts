import { Component, Input } from '@angular/core'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-notion-callout-component',
  standalone: true,
  imports: [NotionTextComponent, CommonModule],
  templateUrl: './notion-callout-component.html',
  styleUrl: './notion-callout-component.sass',
})
export class NotionCalloutComponent {
  @Input() data?: any
}
