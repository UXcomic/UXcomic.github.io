import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { Post } from '../../models/post'
import { environment } from '../../../environments/environment'
import { PostCardComponent } from '../../components/post-card-component/post-card-component'

@Component({
  selector: 'app-posts-section',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: './posts-section.html',
  styleUrl: './posts-section.sass',
})
export class PostsSection {
  @Input() posts?: Post[]

  protected config = environment
}
