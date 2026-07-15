import { Component, ElementRef, inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'app-notion-embed-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notion-embed-component.html',
  styleUrl: './notion-embed-component.sass',
})
export class NotionEmbedComponent implements OnInit {
  @Input() data?: any
  @Input() fullscreen?: boolean

  @ViewChild('embedIframe', { read: ElementRef }) embedIframe?: ElementRef<HTMLIFrameElement>

  protected embedHtml: SafeHtml | null = null
  protected loading = false
  protected error = false

  private http = inject(HttpClient)
  private sanitizer = inject(DomSanitizer)
  private platformId = inject(PLATFORM_ID)

  ngOnInit(): void {
    const url = this.data?.embed?.url
    if (!url) return

    if (!isPlatformBrowser(this.platformId)) return

    this.loading = true
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (html) => {
        const baseUrl = url.substring(0, url.lastIndexOf('/') + 1)
        const htmlWithBase = html.replace('<head>', `<head><base href="${baseUrl}">`)
        this.embedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlWithBase)
        this.loading = false
      },
      error: () => {
        this.error = true
        this.loading = false
      },
    })
  }

  onIframeLoad(): void {
    if (this.fullscreen) return
    this.resizeIframe()
  }

  private resizeIframe(): void {
    const iframe = this.embedIframe?.nativeElement
    if (!iframe?.contentWindow?.document) return

    const doc = iframe.contentWindow.document
    const height = Math.max(
      doc.documentElement.scrollHeight,
      doc.body.scrollHeight,
      doc.documentElement.offsetHeight,
      doc.body.offsetHeight,
    )

    if (height > 0) {
      iframe.style.height = `${height}px`
    }

    // Watch for dynamic content changes (e.g. images loading)
    const observer = new MutationObserver(() => {
      const updatedHeight = Math.max(
        doc.documentElement.scrollHeight,
        doc.body.scrollHeight,
        doc.documentElement.offsetHeight,
        doc.body.offsetHeight,
      )
      if (updatedHeight > 0 && updatedHeight !== height) {
        iframe.style.height = `${updatedHeight}px`
      }
    })

    observer.observe(doc.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
}
