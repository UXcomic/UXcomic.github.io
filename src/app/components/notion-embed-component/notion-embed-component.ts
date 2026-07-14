import { Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { isPlatformBrowser } from '@angular/common'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'app-notion-embed-component',
  standalone: true,
  templateUrl: './notion-embed-component.html',
  styleUrl: './notion-embed-component.sass',
})
export class NotionEmbedComponent implements OnInit {
  @Input() data?: any

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
}
