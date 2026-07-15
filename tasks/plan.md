# Plan: Fullscreen Embed Mode on Post Page

## Overview

Khi bài viết có chứa iframe HTML (embed block), toàn bộ trang chi tiết bài viết chuyển sang chế độ fullscreen: ẩn title/date, loại bỏ width constraint, iframe fill toàn bộ viewport.

## Current Architecture

```
post.html
  <section max-w-[600px] mx-auto>       ← giới hạn width
    app-post-card (hidden khi hasEmbed)
    app-post-content-section
      ├── div: title + date              ← cần ẩn khi hasEmbed
      ├── article > post-content-detail-section
      │     └── notion-embed-component
      │           └── iframe (height: auto) ← cần full màn hình
      ├── relevant posts section
      └── action bar (hidden khi hasEmbed)
```

## Why Not ::ng-deep / Global CSS

`::ng-deep` bị deprecate và Angular View Encapsulation.Emulated sẽ gây xung đột specificity với component styles đã scoped. Giải pháp: thêm `@Input() fullscreen` vào `NotionEmbedComponent` để nó tự điều chỉnh CSS — đây là cách sạch nhất, đúng Angular patterns.

## Dependency Graph

```
post.ts
  └── hasEmbed flag (đã có)

post.html                             Task 1, 2
  ├── [hideTitle]="hasEmbed"          ───→ post-content-section (đã có @Input)
  ├── post--embed CSS class           ───→ post.sass
  └── app-notion-embed-component
        └── [fullscreen]="hasEmbed"   ───→ embed component

notion-embed-component.ts             Task 2
  └── @Input() fullscreen? → CSS class .notion-embed--fullscreen

notion-embed-component.sass           Task 2
  └── .notion-embed--fullscreen iframe: 100vw x 100dvh
```

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Post có embed + content khác (paragraph, image trước embed) | Thấp — title ẩn nhưng content khác vẫn hiện | Giữ nguyên behavior, user muốn toàn trang tập trung vào embed |
| Nhiều embed blocks trong một bài | Thấp — mỗi embed đều fullscreen | Thường chỉ 1 embed/page; nếu nhiều, cái cuối cùng chiếm space |
| SSR / no-JS: fullscreen class không áp dụng | Thấp — fallback về layout thường | Server render vẫn có class; hydration đồng bộ |

## Task List

### Task 1: Wire hideTitle + hideRelevantPosts + post--embed layout

Pass `hideTitle` và `hideRelevantPosts` từ post page xuống content section. Thêm CSS class `post--embed` khi `hasEmbed` để loại bỏ width constraint.

- Files: `src/app/pages/post/post.html`, `src/app/pages/post/post.sass`
- Files: `src/app/sections/post-content-section/post-content-section.html` (wrap relevant posts in @if)
- Files: `src/app/sections/post-content-section/post-content-section.ts` (thêm @Input hideRelevantPosts)
- Size: S (4 files)

### Task 2: Add fullscreen mode to embed component

Thêm `@Input() fullscreen` vào `NotionEmbedComponent`. Khi `fullscreen=true`, iframe dùng `100vw x 100dvh` thay vì auto-height.

Truyền `[fullscreen]="hasEmbed"` từ `post-content-detail-section.html` (cần pass-through từ post → detail-section → embed).

- Files: `src/app/components/notion-embed-component/notion-embed-component.ts` (thêm Input + logic)
- Files: `src/app/components/notion-embed-component/notion-embed-component.html` (class binding)
- Files: `src/app/components/notion-embed-component/notion-embed-component.sass` (fullscreen styles)
- Files: `src/app/sections/post-content-detail-section/post-content-detail-section.html` (pass fullscreen)
- Files: `src/app/sections/post-content-detail-section/post-content-detail-section.ts` (thêm @Input fullscreen)
- Size: S (5 files)

### Checkpoint: Core flow
- [ ] `ng build` thành công
- [ ] Title/date ẩn khi hasEmbed=true
- [ ] Iframe full màn hình khi hasEmbed=true
- [ ] Notion components khác không bị ảnh hưởng

## Open Questions

- Post có cả embed + content text: có nên ẩn hết content khác hay chỉ ẩn title?
