import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { PostContent } from '../../models/post-content'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { environment } from '../../../environments/environment'
import { PostContentDetailSection } from '../post-content-detail-section/post-content-detail-section'
import { getRelevantPosts } from '../../utils/post-helper'
import { PostCardComponent } from '../../components/post-card-component/post-card-component'
import { FlowbiteService } from '../../services/flowbite.service'
import { initFlowbite, CopyClipboard, CopyClipboardInterface, Tooltip, TooltipInterface } from 'flowbite'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipe from 'photoswipe'

@Component({
  selector: 'app-post-content-section',
  standalone: true,
  imports: [CommonModule, PostContentDetailSection, PostCardComponent],
  templateUrl: './post-content-section.html',
  styleUrl: './post-content-section.sass',
})
export class PostContentSection implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('postUrlInputElementRef') postUrlInputElementRef!: ElementRef
  @ViewChild('postUrlButtonElementRef') postUrlButtonElementRef!: ElementRef
  @ViewChild('copyPostUrlTooltipElementRef') copyPostUrlTooltipElementRef!: ElementRef
  @ViewChild('copyPostUrlDefaultTooltipMessageElementRef') copyPostUrlDefaultTooltipMessageElementRef!: ElementRef
  @ViewChild('copyPostUrlSuccessTooltipMessageElementRef') copyPostUrlSuccessTooltipMessageElementRef!: ElementRef

  @Input() copyLink?: string
  @Input() postContent?: PostContent
  @Input() hideTitle?: boolean

  protected config = environment
  protected relevantPosts?: any[] = []
  protected like?: boolean = false
  protected unlike?: boolean = false
  protected postUrlClipboard?: CopyClipboardInterface
  protected tooltip?: TooltipInterface

  private flowbiteService = inject(FlowbiteService)
  private platformId = inject(PLATFORM_ID)
  private ngZone = inject(NgZone)

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postContent'] && this.postContent) {
      this.setRelevantPosts()
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initPostUrlClipboard()
      this.initPostUrlTooltip()
      this.initPhotoswipe()
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

  private initPostUrlClipboard() {
    this.postUrlClipboard = new CopyClipboard(
      this.postUrlButtonElementRef.nativeElement,
      this.postUrlInputElementRef.nativeElement,
      {
        contentType: 'input',
        htmlEntities: false,
        onCopy: (clipboard) => {},
      },
      {
        id: this.postUrlButtonElementRef.nativeElement.id,
        override: true,
      },
    )
  }

  private initPostUrlTooltip() {
    this.tooltip = new Tooltip(
      this.copyPostUrlTooltipElementRef.nativeElement,
      this.postUrlButtonElementRef.nativeElement,
      {
        placement: 'top',
        triggerType: 'hover',
      },
      {
        id: this.copyPostUrlTooltipElementRef.nativeElement.id,
        override: true,
      },
    )

    this.tooltip.init()
  }

  private initPhotoswipe() {
    this.ngZone.runOutsideAngular(() => {
      const lightbox = new PhotoSwipeLightbox({
        gallery: `article`,
        children: 'a.notion-image__viewer-link',
        pswpModule: PhotoSwipe,
        loop: false,
        allowPanToNext: false,
        initialZoomLevel: 'fit',
        secondaryZoomLevel: 1.5,
        maxZoomLevel: 1,
      })
      lightbox.init()
    })
  }

  async sharePost() {
    await navigator.share({
      title: this.postContent?.title,
      text: '',
      url: this.copyLink ? this.copyLink : `${this.config.baseUrl}/post/${this.postContent?.slug}`,
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

  handleCopyPostUrlClicked() {
    this.postUrlClipboard?.copy()
    this.handlePostUrlTooltipMessageCopied()

    setTimeout(() => {
      this.resetPostUrlTooltipMessageDefault()
    }, 2000)
  }

  private handlePostUrlTooltipMessageCopied() {
    this.copyPostUrlDefaultTooltipMessageElementRef.nativeElement.classList.add('hidden')
    this.copyPostUrlSuccessTooltipMessageElementRef.nativeElement.classList.remove('hidden')
    this.tooltip?.show()
  }

  private resetPostUrlTooltipMessageDefault() {
    this.copyPostUrlDefaultTooltipMessageElementRef.nativeElement.classList.remove('hidden')
    this.copyPostUrlSuccessTooltipMessageElementRef.nativeElement.classList.add('hidden')
    this.tooltip?.hide()
  }
}
