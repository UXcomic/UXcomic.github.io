import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { Post } from '../../models/post'

@Component({
  selector: 'app-posts-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts-section.html',
  styleUrl: './posts-section.sass',
})
export class PostsSection {
  @Input() posts?: Post[]
}
