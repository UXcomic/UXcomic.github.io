# Spec: Title + Thumbnail cho post embed trên trang bài viết

## Objective

Bổ sung **title** và **hình ảnh thumbnail** của bài viết vào trang `/post/:slug` **chỉ khi `hasEmbed === true`** (chế độ fullscreen embed). Title + thumbnail hiển thị ngay trong **top header 64px** hiện có, nằm bên trái nút close.

**Người dùng:** Độc giả đang xem một bài viết dạng embed fullscreen — lướt nhanh nội dung, cần nhìn thấy ngay bài viết đang đọc là gì.

**Lý do:** Ở chế độ embed, post-card bị ẩn và title bị hide nên người đọc không còn ngữ cảnh về bài viết đang xem. Header hiện chỉ có nút X → bổ sung title + thumbnail để nhận diện bài viết trong khi giữ header gọn.

**Tiêu chí thành công:**
- Khi `hasEmbed`, header hiển thị thumbnail (40x40px) + title (style `%title-1`, 1 dòng, truncate) ở bên trái, nút close giữ nguyên bên phải
- Khi `!hasEmbed`, header giữ nguyên hành vi hiện tại (chỉ nút close bên phải, `justify-end`)
- Nếu post không có cover, chỉ hiển thị title (ẩn thumbnail)
- Title + thumbnail là phần hiển thị tĩnh, không phải link
- Không thay đổi hành vi / route của nút close

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | Angular 20 (standalone components) |
| Styling | Tailwind CSS + SASS (`.sass`) |
| Typography | `%title-1` từ `src/app/styles/_typography.sass` (Inter bold, 22px/32px) |
| Ảnh | Plain `<img>` (không qua Cloudinary) — cover of embed post là external URL (codia.ai) không có `public_id` |
| SSR | Angular SSR — header thuần static, không truy cập `window` |
| Test | Karma + Jasmine |

## Commands

```
Build:  pnpm build
Test:   pnpm test
Lint:   pnpm prettier:check
Format: pnpm prettier
Dev:    pnpm start
```

## Project Structure

Thay đổi nằm trong component `Post` duy nhất. Không tạo component/helper mới.

```
src/app/pages/post/
  post.html   → Thêm block title + thumbnail bên trái header (chỉ khi hasEmbed)
  post.sass   → Style title dùng %title-1 (`@use '../../styles/typography'`)
  post.ts     → Thêm method/property nhỏ để expose cover URL (file.url || external.url)
  post.spec.ts→ Thêm test cho block title + thumbnail khi hasEmbed
```

## Code Style

Trong `post.html`, header chuyển từ `justify-end` sang điều kiện: khi `hasEmbed` dùng `justify-between`, ngược lại giữ `justify-end`. Block trái chỉ render khi `hasEmbed`:

```html
<header
  class="top-header sticky top-0 z-50 h-[64px] pl-[16px] pr-[16px] flex items-center"
  [class.justify-between]="hasEmbed"
  [class.justify-end]="!hasEmbed"
>
  @if (hasEmbed) {
  <div class="flex items-center gap-x-[12px] min-w-0">
    <img
      *ngIf="coverUrl"
      [src]="coverUrl"
      [alt]="post?.title"
      class="w-[40px] h-[40px] rounded-[8px] object-cover shrink-0"
      width="40"
      height="40"
    />
    <h1 class="post__embed-title truncate min-w-0">{{ post?.title }}</h1>
  </div>
  }
  <a
    [routerLink]="`/blog/${post.category?.slug}/${post.tag?.slug}`"
    aria-label="Close article"
    class="w-[48px] h-[48px] bg-white/75 border-[2px] border-white rounded-full flex items-center justify-center shrink-0"
  >
    ... SVG close giữ nguyên ...
  </a>
</header>
```

Trong `post.ts`, expose cover URL hỗ trợ cả hai dạng file/external:

```ts
protected get coverUrl(): string {
  const image = this.post?.cover?.image
  return image?.file?.url || image?.external?.url || ''
}
```

Trong `post.sass`:

```sass
@use '../../styles/colors'
@use '../../styles/typography'

.top-header
  background-color: colors.$color-bg

.post
  &__embed-title
    @extend %title-1
```

Quy tắc:
- Dùng Tailwind utility (`w-[40px] h-[40px]`, `truncate`, `gap-x-[12px]`...) cho layout; chỉ dùng SASS cho typography (`%title-1`) không làm được bằng utility
- Không hardcode màu hex; không dùng Cloudinary cho thumbnail embed
- Title dùng `@extend %title-1` + `truncate` (1 dòng, line-height 32px phù hợp header 64px)
- Không thêm link/click cho thumbnail–title block

## Testing Strategy

| Cấp độ | Công cụ | Vị trí |
|--------|---------|--------|
| Unit | Karma + Jasmine | `src/app/pages/post/post.spec.ts` |

Test coverage tối thiểu:
- Khi `hasEmbed=true` và post có cover: `<img>` thumbnail render (src = cover URL, kích thước 40x40) và title hiển thị
- Khi `hasEmbed=true` và post không có cover (`cover: null`): không render `<img>`, title vẫn hiển thị
- Khi `hasEmbed=false`: block title + thumbnail không render, header vẫn chỉ có nút close
- Existing tests (close link, header hiển thị khi embed) vẫn pass — không regression

## Boundaries

- **Luôn làm:**
  - Chỉ render title + thumbnail khi `hasEmbed === true`
  - Thumbnail 40x40px (`w-[40px] h-[40px]`), bo tròn, `object-cover`
  - Title dùng `%title-1` qua `@extend` trong `post.sass`, 1 dòng `truncate`
  - Hỗ trợ cả `image.file.url` và `image.external.url` cho cover
  - Nếu không có cover → ẩn thumbnail, chỉ title
  - Giữ nguyên nút close, route, và header trong mọi chế độ
  - Update `post.spec.ts` song song với template

- **Hỏi trước:**
  - Đổi vị trí title/thumbnail ra ngoài header (block riêng)
  - Cho title/thumbnail thành link điều hướng
  - Đổi kích thước thumbnail / style title khác `%title-1`
  - Hiển thị title + thumbnail ở cả chế độ không embed
  - Dùng Cloudinary/CDN xử lý ảnh thumbnail thay vì `<img>` trực tiếp

- **Không bao giờ:**
  - Truy cập `window`/`document` (SSR-safe)
  - Thêm data model mới / sửa `PostContent`
  - Hardcode màu hex qua biến ngoài `_colors.sass`
  - Bỏ qua/cập nhật `post.spec.ts`
  - Render title + thumbnail khi `!hasEmbed` (thay đổi layout mặc định ngoài phạm vi)

## Success Criteria

- [ ] Khi mở `/post/:slug` của embed post: header hiện thumbnail 40x40 bên trái + title truncate 1 dòng, nút X bên phải
- [ ] Khi `hasEmbed=true` nhưng post không có cover: chỉ hiện title, không có `<img>`
- [ ] Khi `!hasEmbed`: header giữ nguyên chỉ nút close, không có title/thumbnail
- [ ] Title dùng đúng typography `%title-1` (Inter bold 22px/32px)
- [ ] `pnpm test` pass (spec mới + không regression)
- [ ] `pnpm prettier:check` pass trên các file thay đổi
- [ ] `pnpm build` (SSR) không lỗi

## Open Questions

- [x] Vị trí: trong top header, bên trái nút close
- [x] Nguồn ảnh: `post.cover` (cả `file.url` lẫn `external.url`); không cover → ẩn ảnh
- [x] Title: `%title-1`, 1 dòng truncate
- [x] Có phải link không: không, chỉ hiển thị tĩnh