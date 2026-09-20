# Todo: Title + Thumbnail cho post embed

## Task 1: Thêm coverUrl getter + template title/thumbnail + style

- [ ] Header dùng `justify-between` khi `hasEmbed`, `justify-end` khi không
- [ ] `hasEmbed=true` + có cover: render img 40x40 + title truncate 1 dòng
- [ ] `hasEmbed=true` + không cover: không render img, vẫn hiện title
- [ ] `coverUrl` resolver trả đúng URL từ cả `file.url` lẫn `external.url`
- [ ] Title dùng `%title-1` (Inter bold 22px/32px) qua `@extend`

**Verify:** `pnpm build`; `pnpm prettier:check`; manual check header ở 2 chế độ

**Files:** `post.ts`, `post.html`, `post.sass`

## Task 2: Test title + thumbnail behavior

- [ ] Test case embed + có cover pass (img src = cover URL, title present)
- [ ] Test case embed + `cover:null` pass (không img, title present)
- [ ] Test case non-embed pass (không title/thumb, close link vẫn đúng)
- [ ] Toàn bộ suite `post.spec.ts` pass, không regression

**Verify:** `pnpm test`; `pnpm prettier:check`

**Files:** `post.spec.ts`

## Checkpoint: Hoàn thành

- [ ] Acceptance criteria Task 1 + Task 2 đạt
- [ ] `pnpm test` pass (không regression)
- [ ] `pnpm prettier:check` pass
- [ ] `pnpm build` (SSR) thành công
- [ ] Review human trước khi merge (Definition of Done)