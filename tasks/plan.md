# Implementation Plan: Title + Thumbnail cho post embed

## Overview

Khi `hasEmbed === true` (chế độ fullscreen embed), top header của trang `/post/:slug` sẽ hiển thị thêm thumbnail 40x40 + title (typography `%title-1`, truncate 1 dòng) ở bên trái nút close. Không embed: giữ nguyên header chỉ có nút close. Cover URL hỗ trợ cả `image.file.url` lẫn `image.external.url`; không có cover thì ẩn ảnh.

## Architecture Decisions

- **Không tạo component/helper mới:** Feature bé, nằm gọn trong component `Post`. Thêm một `get coverUrl()` trong `post.ts` để resolve cover URL hỗ trợ 2 dạng.
- **Plain `<img>` thay vì Cloudinary:** Cover của embed post là external URL (codia.ai) không có `public_id` nên không thể dùng `advanced-image`/Cloudinary như post-card.
- **Layout qua Tailwind, typography qua SASS:** Dùng `justify-between` (conditional class) khi `hasEmbed`; `%title-1` + `truncate` cho title. `class.justify-between`/`class.justify-end` trên header, block trái bọc trong `@if (hasEmbed)`.
- **SSR-safe:** Không truy cập `window`/`document`, thuần template + getter.

## Current Architecture

```
post.html  header.top-header (sticky top-0 z-50 h-[64px] flex items-center justify-end)
             └── a[routerLink=/blog/:cat/:tag] ✕ close (bên phải)
post.sass  @use colors; .top-header background-color: $color-bg
post.ts    Post.onInit → set post, hasEmbed, title, meta
post.spec.ts → test close link + header tồn tại khi embed
```

## Task List

### Task 1: Thêm coverUrl getter + template title/thumbnail + style

**Description:** Trong `post.ts` thêm `protected get coverUrl()` trả về `post.cover.image.file.url || post.cover.image.external.url || ''`. Trong `post.html` đổi header sang `justify-between` khi `hasEmbed` (conditional class), thêm block trái chỉ render khi `hasEmbed`: `<img>` 40x40 (chỉ khi có coverUrl) + `<h1>` title với class `post__embed-title truncate`. Trong `post.sass` `@use '../../styles/typography'` và `%title-1` cho `post__embed-title`.

**Acceptance criteria:**
- [ ] Header dùng `justify-between` khi `hasEmbed`, `justify-end` khi không
- [ ] `hasEmbed=true` + có cover: render img 40x40 (`w-[40px] h-[40px]`, `object-cover`, `rounded-[8px]`) + title truncate 1 dòng
- [ ] `hasEmbed=true` + không cover: không render img, vẫn hiện title
- [ ] `coverUrl` resolver trả đúng URL từ cả `file.url` lẫn `external.url`
- [ ] Title dùng `%title-1` (Inter bold 22px/32px) qua `@extend`

**Verification:**
- [ ] `pnpm build` thành công
- [ ] `pnpm prettier:check` pass
- [ ] Manual: mở embed post (vd `/post/test`) — header hiện thumb + title; mở post thường — header chỉ nút X

**Dependencies:** None

**Files likely touched:**
- `src/app/pages/post/post.ts`
- `src/app/pages/post/post.html`
- `src/app/pages/post/post.sass`

**Estimated scope:** S (3 files)

### Task 2: Test title + thumbnail behavior

**Description:** Bổ sung test trong `post.spec.ts`: (1) khi `hasEmbed=true` và post có cover — img thumbnail render với đúng `src`, title hiển thị; (2) khi `hasEmbed=true` và `cover` null — không có img, title vẫn hiển thị; (3) khi `!hasEmbed` — block title/thumb không render, header chỉ có nút close. Đảm bảo các test hiện có không regression.

**Acceptance criteria:**
- [ ] Test case embed + có cover pass (img src = cover URL, title present)
- [ ] Test case embed + `cover:null` pass (không img, title present)
- [ ] Test case non-embed pass (không title/thumb, close link vẫn đúng)
- [ ] Toàn bộ suite `post.spec.ts` pass, không regression

**Verification:**
- [ ] `pnpm test` pass
- [ ] `pnpm prettier:check` pass

**Dependencies:** Task 1

**Files likely touched:**
- `src/app/pages/post/post.spec.ts`

**Estimated scope:** S (1 file)

### Checkpoint: Hoàn thành
- [ ] Acceptance criteria Task 1 + Task 2 đạt
- [ ] `pnpm test` pass (không regression)
- [ ] `pnpm prettier:check` pass
- [ ] `pnpm build` (SSR) thành công
- [ ] Review human trước khi merge (Definition of Done)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Title dài phá vỡ layout header 64px | Thấp | `truncate` + `min-w-0`/`min-w-0` wrapper control; 22px/32px vừa vặn 64px header |
| Cover thiếu `file.url` (external) dẫn tới ảnh vỡ | Trung bình | `coverUrl` fallback `file.url || external.url || ''`; trống thì ẩn img |
| Regression khi `!hasEmbed` | Thấp | Block bọc trong `@if (hasEmbed)` + conditional class; test non-embed trong Task 2 |

## Open Questions

- [x] Không còn — spec đã xác nhận đầy đủ