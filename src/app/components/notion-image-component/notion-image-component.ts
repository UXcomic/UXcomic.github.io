import { AfterViewInit, Component, inject, Input, PLATFORM_ID, NgZone } from '@angular/core'
import { environment } from '../../../environments/environment'
import { NotionTextComponent } from '../notion-text-component/notion-text-component'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipe from 'photoswipe'
import 'photoswipe/photoswipe.css'
import { isPlatformBrowser } from '@angular/common'

@Component({
  selector: 'app-notion-image-component',
  standalone: true,
  imports: [NotionTextComponent],
  templateUrl: './notion-image-component.html',
  styleUrl: './notion-image-component.sass',
})
export class NotionImageComponent implements AfterViewInit {
  @Input() data?: any
  @Input() notInSlider?: boolean

  protected config = environment

  private platformId = inject(PLATFORM_ID)
  private ngZone = inject(NgZone)

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        const lightbox = new PhotoSwipeLightbox({
          gallery: `#image-${this.data.id} a`,
          pswpModule: PhotoSwipe,
        })
        lightbox.init()
      })
    }
  }
}
