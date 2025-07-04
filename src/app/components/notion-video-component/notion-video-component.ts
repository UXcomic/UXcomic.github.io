import { Component, Input } from '@angular/core'
import { YouTubePlayer } from '@angular/youtube-player'

@Component({
  selector: 'app-notion-video-component',
  standalone: true,
  imports: [YouTubePlayer],
  templateUrl: './notion-video-component.html',
  styleUrl: './notion-video-component.sass',
})
export class NotionVideoComponent {
  @Input() data?: any
}
