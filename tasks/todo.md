# Tasks: Upload Embed HTML to Cloudinary

- [ ] Task 1: Thêm function `handleUploadEmbedsToCloudinary`
  - Acceptance: Function download HTML từ `embed.url`, upload Cloudinary, ghi đè `embed.url` bằng Cloudinary URL, giữ nguyên `embed.caption`
  - Verify: Chạy script, check log `[Cloudinary] Embed success`
  - Files: `scripts/fetch-from-notion.mjs`

- [ ] Task 2: Gọi `handleUploadEmbedsToCloudinary` trong `processFetchContent`
  - Acceptance: Function được gọi sau `handleUploadImagesToCloudinary` ở mỗi level content
  - Verify: Embed blocks trong children cũng được xử lý nhờ `fetchChildren`
  - Files: `scripts/fetch-from-notion.mjs`

- [ ] Task 3: Chạy thử và verify output
  - Acceptance: `posts.json` chứa embed blocks với Cloudinary URL
  - Verify: `node scripts/fetch-from-notion.mjs` + kiểm tra log + kiểm tra file
  - Files: `public/data/posts.json`
