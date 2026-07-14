# Spec: Upload Embed HTML Files to Cloudinary

## Objective

Bổ sung xử lý embed blocks trong Notion content — download file HTML từ `embed.url`, upload lên Cloudinary, và ghi đè URL bằng Cloudinary URL trước khi lưu vào `posts.json`.

**Target user:** Script `fetch-from-notion.mjs` chạy ở server-side khi fetch dữ liệu từ Notion API.

**Success criteria:**
- Embed blocks trong Notion content được xử lý tự động (download → upload → replace URL)
- `embed.url` trong `posts.json` trỏ đến Cloudinary thay vì S3 URL gốc từ Notion
- `embed.caption` được giữ nguyên
- Không ảnh hưởng đến image blocks hoặc các block type khác

## Tech Stack

- **Runtime:** Node.js 20+ (ESM)
- **Cloud SDK:** `cloudinary` v2
- **Upload method:** `cloudinary.uploader.upload(url, { public_id, overwrite: false })`
- **Không chỉ định folder** (upload vào default Cloudinary folder)

## Commands

```bash
# Run fetch script
node scripts/fetch-from-notion.mjs
```

## Project Structure

```
scripts/
└── fetch-from-notion.mjs    # File cần sửa — thêm hàm xử lý embed
public/data/
└── posts.json                # Output — embed.url sẽ là Cloudinary URL
```

## Code Style

- Dùng `async/await`, error logging pattern giống `handleUploadImagesToCloudinary`
- Log prefix: `[Cloudinary]` cho upload actions
- Biến đặt tên tiếng Anh, rõ ràng

## Testing Strategy

- **Manual:** Chạy script và kiểm tra `posts.json` — embed block có `embed.url` trỏ đến Cloudinary
- **Eye check:** Đếm số lượng "Embed success" logs sau khi chạy
- Không có unit test hiện tại; chỉ verify bằng cách run script

## Boundaries

- **Always:**
  - Xử lý tất cả `embed` blocks trong content (bao gồm children)
  - Giữ nguyên `embed.caption`
  - Dùng `overwrite: false` để không ghi đè file đã upload
  - Log success/failed count sau khi xử lý

- **Ask first:**
  - Thay đổi Cloudinary folder config
  - Xóa/thay đổi caption
  - Xử lý file HTML cũ (cleanup unused)

- **Never:**
  - Xóa hoặc modify các block type khác ngoài embed
  - Upload file không phải HTML từ embed block
  - Bỏ qua error handling

## Open Questions

- [ ] Có cần xử lý cleanup URL cũ (xóa file HTML cũ trên Cloudinary khi URL thay đổi)?
