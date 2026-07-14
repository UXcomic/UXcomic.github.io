# Plan: Upload Embed HTML to Cloudinary

## Overview

Thêm function `handleUploadEmbedsToCloudinary` vào `scripts/fetch-from-notion.mjs` để xử lý embed blocks tương tự `handleUploadImagesToCloudinary`.

## Components

1. **New function:** `handleUploadEmbedsToCloudinary(contentArray)` — download HTML từ `embed.url`, upload Cloudinary, replace URL
2. **Integration point:** Gọi function mới trong `processFetchContent` ngay sau `handleUploadImagesToCloudinary`

## Dependency Graph

```
handleUploadEmbedsToCloudinary  (no internal deps, standalone)
        │
        ▼
processFetchContent  (gọi hàm mới)
        │
        ▼
fetchContents → fetchAll
```

## Implementation Order

1. Thêm `handleUploadEmbedsToCloudinary` function (mirror `handleUploadImagesToCloudinary`)
2. Thêm call trong `processFetchContent`
3. Chạy thử script để verify

## Risks

| Risk | Mitigation |
|------|-----------|
| `cloudinary.uploader.upload` fail với file HTML | Dùng `resource_type: 'raw'` nếu cần; fallback giữ nguyên URL gốc |
| File HTML quá lớn | Cloudinary free plan giới hạn; log warning nếu fail |
| Embed block có children | `fetchChildren` đã xử lý đệ quy; chỉ cần gọi ở từng level |

## Verification

- Chạy `node scripts/fetch-from-notion.mjs`
- Kiểm tra log: `[Cloudinary] Embed success: https://res.cloudinary.com/...`
- Kiểm tra `public/data/posts.json`: embed block có `embed.url` trỏ đến Cloudinary
