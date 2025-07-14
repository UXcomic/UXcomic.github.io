import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core'
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
import { NotionCarouselComponent } from '../../components/notion-carousel-component/notion-carousel-component'
import { register } from 'swiper/element/bundle'
import { Swiper, SwiperOptions } from 'swiper/types'
import { SwiperDirective } from '../../directives/swiper.directive'

register()

@Component({
  selector: 'app-post-content-detail-section',
  standalone: true,
  imports: [
    CommonModule,
    SwiperDirective,
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
    NotionCarouselComponent,
  ],
  templateUrl: './post-content-detail-section.html',
  styleUrl: './post-content-detail-section.sass',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostContentDetailSection {
  @Input() content?: any
  @Input() slider?: boolean

  // slides-per-view="auto"
  //     space-between="12"
  //     centered-slides="true"
  //     [pagination]="{
  //       el: '.numberedaaaaa',
  //       type: 'fraction'
  //     }"

  protected swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 12,
    centeredSlides: true,
    pagination: {
      el: '.notion-carousel__fraction',
      type: 'fraction',
    },
  }
}
