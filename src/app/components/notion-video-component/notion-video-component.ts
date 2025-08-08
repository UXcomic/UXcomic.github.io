import { Component, Input, OnInit } from '@angular/core'
import { YouTubePlayer } from '@angular/youtube-player'
import getVideoId from 'get-video-id'

@Component({
  selector: 'app-notion-video-component',
  standalone: true,
  imports: [YouTubePlayer],
  templateUrl: './notion-video-component.html',
  styleUrl: './notion-video-component.sass',
})
export class NotionVideoComponent implements OnInit {
  @Input() data?: any

  protected videoId: string = ''

  ngOnInit(): void {
    if (!this.data) return
    this.videoId = getVideoId(this.data.video.external.url).id || ''
  }
}
