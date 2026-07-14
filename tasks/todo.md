- [ ] Task 1: Thêm provideHttpClient vào app.config.ts
  - Acceptance: `provideHttpClient(withFetch())` trong providers
  - Verify: `ng build` thành công
  - Files: `src/app/app.config.ts`

- [ ] Task 2: Cập nhật NotionEmbedComponent — fetch Cloudinary → srcdoc
  - Acceptance: Component fetch text từ Cloudinary URL, hiển thị qua srcdoc, SSR-safe, có loading state
  - Verify: `ng build` thành công
  - Files: `src/app/components/notion-embed-component/notion-embed-component.ts`, `.html`, `.sass`

- [ ] Task 3: Build và kiểm tra
  - Acceptance: `ng build` thành công, không lỗi mới
  - Verify: `ng build`
