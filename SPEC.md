# Spec: Notion Embed HTML Viewer Component

## Mục tiêu

Xây dựng component Angular để hiển thị Notion `embed` block chứa file HTML (đã upload lên Cloudinary dạng raw). Component dùng iframe để hiển thị nội dung HTML với kích thước responsive.

**Người dùng:** Độc giả xem nội dung HTML được nhúng trong bài viết Notion.

**Tiêu chí thành công:**
- Embed block render dưới dạng iframe trỏ tới Cloudinary raw URL
- Width: 100% container cha (hiện tại max 600px trên desktop, full width trên mobile)
- Height: `100dvh` (full viewport height)
- Tích hợp vào PostContentDetailSection block dispatcher
- Hoạt động với SSR (không truy cập `window` trực tiếp nếu không có platform check)

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | Angular 20 (standalone components) |
| Styling | Tailwind CSS + SASS (`.sass`) |
| SSR | Angular SSR với hydration |
| Test | Karma + Jasmine |

## Commands

```
Build:  ng build
Test:   ng test
Lint:   prettier --check "./src/**/*.{ts,html,sass,json}"
Format: prettier --write "./src/**/*.{ts,html,sass,json}"
```

## Project Structure

```
src/app/
  components/
    notion-embed-component/
      notion-embed-component.ts       → Class component
      notion-embed-component.html     → Template (iframe)
      notion-embed-component.sass     → Style (height 100dvh)
      notion-embed-component.spec.ts  → Unit test
  sections/
    post-content-detail-section/
      post-content-detail-section.html → Thêm @case('embed')
```

## Code Style

Tuân theo convention hiện tại:

```typescript
@Component({
  selector: 'app-notion-embed-component',
  standalone: true,
  templateUrl: './notion-embed-component.html',
  styleUrl: './notion-embed-component.sass',
})
export class NotionEmbedComponent implements OnInit {
  @Input() data?: any

  embedUrl: SafeResourceUrl | null = null
  private sanitizer = inject(DomSanitizer)

  ngOnInit(): void {
    const url = this.data?.embed?.url
    if (url) this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
```

Template:

```html
@if (embedUrl) {
  <div class="notion-embed">
    <iframe [src]="embedUrl" title="Embedded content" loading="lazy" />
  </div>
}
```

Quy tắc:
- `standalone: true`
- `inject()` DI, không dùng constructor injection
- File đặt tên kebab-case
- `styleUrl` (số ít)

## Testing Strategy

| Cấp độ | Công cụ | Vị trí |
|--------|---------|--------|
| Unit | Karma + Jasmine | `notion-embed-component.spec.ts` |

Test coverage:
- Render iframe khi có URL
- Không render gì khi URL rỗng/null

## Boundaries

- **Luôn làm:**
  - Dùng `DomSanitizer.bypassSecurityTrustResourceUrl()` cho Cloudinary raw URLs
  - Check `isPlatformBrowser` trước khi truy cập `window`/`document`
  - Dùng `height: 100dvh` (dynamic viewport height) qua CSS
  - Thêm `@case('embed')` vào PostContentDetailSection
  - Thêm `loading="lazy"` trên iframe
  - Style với Tailwind + SASS component-specific

- **Hỏi trước:**
  - Thêm dependencies mới
  - Thay đổi data model (`post-content.ts`)
  - Thay đổi cấu trúc block dispatch

- **Không bao giờ:**
  - Hardcode height px
  - Truy cập `window` không có `isPlatformBrowser` guard
  - Bind `[src]` trực tiếp — luôn dùng `SafeResourceUrl` qua `DomSanitizer`
  - Bỏ qua tests

## Open Questions (đã giải quyết)

- [x] Embed URLs đến từ Cloudinary (raw resource type)
- [x] Width: 100% container (giữ trong container max 600px của post page)
- [x] Height: `100dvh` (không trừ header vì post page không có fixed header)
