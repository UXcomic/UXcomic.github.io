# Tasks: Fullscreen Embed Mode

## Phase 1: Post Page Layout

- [ ] Task 1: Wire hideTitle + hideRelevantPosts + post--embed CSS class
  - Acceptance: Khi `hasEmbed=true`, title/date ẩn, relevant posts ẩn, section mở rộng full width
  - Verify: `ng build` thành công
  - Files: `src/app/pages/post/post.html`, `src/app/pages/post/post.sass`, `post-content-section.html`, `post-content-section.ts`

## Phase 2: Embed Component Fullscreen

- [ ] Task 2: Add fullscreen mode to NotionEmbedComponent
  - Acceptance: Khi `fullscreen=true`, iframe dùng `100vw x 100dvh`; mặc định giữ auto-height cũ
  - Verify: `ng build` thành công
  - Files: `notion-embed-component.ts`, `.html`, `.sass`, `post-content-detail-section.html`, `post-content-detail-section.ts`

## Checkpoint

- [ ] Build thành công: `pnpm build`
- [ ] Title/date ẩn trên page có embed
- [ ] Iframe full width + height trên page có embed
- [ ] Notion components khác (paragraph, image, video...) không bị ảnh hưởng
