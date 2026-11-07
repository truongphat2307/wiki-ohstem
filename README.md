# OhStem Wiki Hub

Wiki tài liệu cho OhStem Education, xây dựng trên **Nextra 4** (Next.js 15).

## Tính năng

- 📘 **Wiki tĩnh**: Render từ file Markdown/MDX, build sẵn toàn bộ trang, SEO tối ưu
- 🌗 **Dark/Light mode**: Tự động theo hệ thống
- 📱 **Responsive**: Hiển thị tốt trên mọi thiết bị
- 🧊 **3D Model Viewer**: Xem model `.glb` bằng Babylon.js
- ☁️ **Serverless**: Deploy trên Cloudflare Workers

## Cài đặt

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem wiki.
Admin CMS ở [/admin](http://localhost:3000/admin), Keystatic ở [/keystatic](http://localhost:3000/keystatic) (chỉ có khi chạy local).

## Cấu trúc thư mục

```
├── app/
│   ├── layout.jsx                 # Root layout (Nextra theme)
│   ├── (docs)/[[...mdxPath]]/     # Catch-all MDX route
│   ├── admin/                     # Admin CMS (chỉ local)
│   └── keystatic/                 # Keystatic CMS (chỉ local)
├── components/                    # React components
├── content/                       # Nội dung wiki (Markdown/MDX + _meta.js)
├── public/                        # Hình ảnh, model 3D, _headers
├── next.config.mjs
├── open-next.config.ts            # Cấu hình adapter Cloudflare
└── wrangler.jsonc                 # Cấu hình Cloudflare Worker
```

## Thêm nội dung Wiki

1. Tạo file `.mdx` trong thư mục `content/`
2. Thêm frontmatter title:

   ```mdx
   ---
   title: Tiêu đề trang
   ---
   # Nội dung trang
   ```

3. Cập nhật `_meta.js` tương ứng để hiển thị trong sidebar

## Deploy lên Cloudflare

Site chạy trên **Cloudflare Workers** qua adapter [OpenNext](https://opennext.js.org/cloudflare).
Toàn bộ trang wiki được build sẵn và phục vụ từ static assets.

```bash
npx wrangler login   # lần đầu; hoặc đặt CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
npm run deploy       # build + deploy lên Cloudflare
npm run preview      # build + chạy thử Worker ở local
```

Hoặc nối repo GitHub với **Workers Builds** trong dashboard Cloudflare
(Build command: `npx opennextjs-cloudflare build`, Deploy command: `npx opennextjs-cloudflare deploy`).

### Lưu ý

- **Admin CMS và Keystatic chỉ có ở local** (`npm run dev`). Các file route của chúng có đuôi
  `.admin.js` / `.admin.jsx` (kể cả `middleware.admin.js`), chỉ dev server mới nhận; bản build
  lên Cloudflare không có các trang này. Sửa bài xong thì commit và deploy lại.
- Luôn deploy bằng `npm run deploy` (không chạy `wrangler deploy` trực tiếp), vì bước này của
  OpenNext chép các trang đã render sẵn vào static assets.

## License

© 2025 OhStem Education. All rights reserved.
