import { isPlatformBrowser } from '@angular/common'
import { AfterViewInit, Directive, ElementRef, inject, Input, PLATFORM_ID } from '@angular/core'
import { SwiperOptions } from 'swiper/types'

@Directive({
  selector: '[swiperElement]',
  standalone: true,
})
export class SwiperDirective implements AfterViewInit {
  private readonly swiperElement: HTMLElement

  @Input('config')
  config?: SwiperOptions

  private platformId = inject(PLATFORM_ID)

  constructor(private el: ElementRef<HTMLElement>) {
    this.swiperElement = el.nativeElement
  }

  ngAfterViewInit() {
    Object.assign(this.el.nativeElement, this.config)
    if (isPlatformBrowser(this.platformId))
      // @ts-ignore
      this.el.nativeElement.initialize()
  }
}
