import { CommonModule, Location } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import PostData from '../../../../public/data/posts.json'
import { PostContent } from '../../models/post-content'
import { environment } from '../../../environments/environment'
import { convertPostContent } from '../../utils/post-helper'
import { PostContentSection } from '../../sections/post-content-section/post-content-section'
import { Meta, Title } from '@angular/platform-browser'

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, PostContentSection],
  templateUrl: './about.html',
  styleUrl: './about.sass',
})
export class About implements OnInit {
  protected post?: PostContent
  protected config = environment

  private meta = inject(Meta)
  private title = inject(Title)
  private location = inject(Location)

  goBack() {
    this.location.back()
  }

  ngOnInit(): void {
    const data = (PostData as any[]).find((p: any) => p.id === this.config.aboutPostId)
    this.post = convertPostContent(data)

    this.initTitle()
    this.initMetaTags()
  }

  private initTitle() {
    this.title.setTitle(this.generateTitle() + ' | ' + this.config.prefixOGTitle)
  }

  private initMetaTags() {
    this.updateOGTitle()
  }

  private updateOGTitle() {
    this.meta.updateTag({
      name: 'og:title',
      content: this.generateTitle() + ' | ' + this.config.prefixOGTitle,
    })
  }

  private generateTitle() {
    let name = this.title.getTitle() || this.meta.getTag('name="og:title"')?.content.trim() || ''
    if (this.post?.title) name = this.post.title
    return name
  }
}
