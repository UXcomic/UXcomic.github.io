import { Component, Input, OnInit } from '@angular/core'
import { NotionParagraphComponent } from '../../components/notion-paragraph-component/notion-paragraph-component'
import { NotionImageComponent } from '../../components/notion-image-component/notion-image-component'
import { NotionDividerComponent } from '../../components/notion-divider-component/notion-divider-component'
import { NotionHeading2Component } from '../../components/notion-heading-2-component/notion-heading-2-component'
import { NotionHeading3Component } from '../../components/notion-heading-3-component/notion-heading-3-component'
import { CommonModule } from '@angular/common'
import { NotionCalloutComponent } from '../../components/notion-callout-component/notion-callout-component'
import { NotionHeading1Component } from '../../components/notion-heading-1-component/notion-heading-1-component'
import { NotionBulletedListItemComponent } from '../../components/notion-bulleted-list-item-component/notion-bulleted-list-item-component'
import { NotionNumberedListItemComponent } from '../../components/notion-numbered-list-item-component/notion-numbered-list-item-component'
import { NotionVideoComponent } from '../../components/notion-video-component/notion-video-component'

@Component({
  selector: 'app-post-content-detail-section',
  standalone: true,
  imports: [
    CommonModule,
    NotionParagraphComponent,
    NotionImageComponent,
    NotionDividerComponent,
    NotionHeading2Component,
    NotionHeading3Component,
    NotionCalloutComponent,
    NotionHeading1Component,
    NotionBulletedListItemComponent,
    NotionNumberedListItemComponent,
    NotionVideoComponent,
  ],
  templateUrl: './post-content-detail-section.html',
  styleUrl: './post-content-detail-section.sass',
})
export class PostContentDetailSection {
  @Input() content?: any
}
