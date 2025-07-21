import { AfterViewInit, Component, ElementRef, inject, Input, PLATFORM_ID, ViewChild } from '@angular/core'
import { environment } from '../../../environments/environment'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'
import { isPlatformBrowser } from '@angular/common'

@Component({
  selector: 'app-notion-image-component',
  standalone: true,
  imports: [NotionTextComponent],
  templateUrl: './notion-image-component.html',
  styleUrl: './notion-image-component.sass',
})
export class NotionImageComponent implements AfterViewInit {
  @ViewChild('notionImageElementRef') notionImageElementRef!: ElementRef
  @ViewChild('notionImageViewerLinkElementRef') notionImageViewerLinkElementRef!: ElementRef

  @Input() data?: any
  @Input() notInSlider?: boolean

  protected config = environment

  private platformId = inject(PLATFORM_ID)

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.notionImageElementRef.nativeElement.onload = () => {
        this.notionImageViewerLinkElementRef.nativeElement.setAttribute(
          'data-pswp-width',
          this.notionImageElementRef.nativeElement.naturalWidth,
        )
        this.notionImageViewerLinkElementRef.nativeElement.setAttribute(
          'data-pswp-height',
          this.notionImageElementRef.nativeElement.naturalHeight,
        )
      }
    }
  }
}
