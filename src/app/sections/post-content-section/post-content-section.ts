import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { PostContent } from '../../models/post-content'
import { CommonModule } from '@angular/common'
import { environment } from '../../../environments/environment'
import { PostContentDetailSection } from '../post-content-detail-section/post-content-detail-section'
import { getRelevantPosts } from '../../utils/post-helper'
import { PostCardComponent } from '../../components/post-card-component/post-card-component'

@Component({
  selector: 'app-post-content-section',
  standalone: true,
  imports: [CommonModule, PostContentDetailSection, PostCardComponent],
  templateUrl: './post-content-section.html',
  styleUrl: './post-content-section.sass',
})
export class PostContentSection implements OnInit, OnChanges {
  @Input() postContent?: PostContent
  @Input() hideTitle?: boolean

  protected config = environment
  protected relevantPosts?: any[] = []
  protected like?: boolean = false
  protected unlike?: boolean = false

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postContent'] && this.postContent) {
      this.setRelevantPosts()
    }
  }

  private setRelevantPosts() {
    if (this.postContent) {
      const relevant = getRelevantPosts(this.postContent.content)
      this.relevantPosts = relevant.posts
      this.postContent.content = this.postContent.content.filter(
        (c) => !relevant.contentItems.some((itm: any) => itm.id === c.id),
      )
    }
  }

  async sharePost() {
    await navigator.share({
      title: this.postContent?.title,
      text: this.postContent?.title,
      url: `${this.config.baseUrl}/post/${this.postContent?.slug}`,
    })
  }

  handleLikeClicked(action: string) {
    if (action === 'like') {
      this.like = !this.like
      this.unlike = false
    } else {
      this.like = false
      this.unlike = !this.unlike
    }
  }
}
