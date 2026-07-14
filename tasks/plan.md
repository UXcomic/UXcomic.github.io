# Plan: Fix Embed HTML Download — Cloudinary fetch + srcdoc

## Root Cause

Cloudinary raw upload → `Content-Disposition: attachment` → browser download

## Giải pháp

Thay vì iframe `[src]` (trỏ URL → browser đọc headers → download), dùng:
1. `HttpClient` fetch nội dung HTML từ Cloudinary raw URL (dạng text)
2. iframe `[srcdoc]` = nội dung HTML string

Browser đọc `srcdoc` trực tiếp, bỏ qua Content-Disposition.

## Kiến trúc

```
fetch-from-notion.mjs
  ├── Download HTML từ Notion S3
  ├── Upload → Cloudinary (raw, giữ nguyên)
  └── obj.embed.url = Cloudinary URL

notion-embed-component
  ├── SSR: render placeholder
  ├── Browser: HttpClient.get(Cloudinary URL) → text
  ├── Loading state: spinner
  ├── Success: iframe [srcdoc]="embedHtml"
  └── Error: fallback / error message
```

## Dependencies

```
app.config.ts → thêm provideHttpClient(withFetch())
  └── notion-embed-component → inject HttpClient
      └── fetch Cloudinary → srcdoc
```

## Tasks

### Phase 1: Setup HttpClient
Task 1: Add provideHttpClient to app.config.ts

### Phase 2: Fix component
Task 2: Rewrite NotionEmbedComponent — fetch + srcdoc + loading/error states

### Checkpoint
Task 3: Build & verify
