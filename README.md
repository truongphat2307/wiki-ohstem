# 🤖 OhStem Wiki Hub

Hệ thống Wiki thông minh cho OhStem Education, xây dựng trên **Nextra 4** + **MiniMax AI**.

## Tính năng

- 📘 **Wiki tĩnh**: Render nhanh từ file Markdown/MDX, SEO tối ưu
- 🤖 **Trợ lý AI**: Chatbot tích hợp, trả lời dựa trên nội dung wiki
- 🌗 **Dark/Light mode**: Tự động theo hệ thống
- 📱 **Responsive**: Hiển thị tốt trên mọi thiết bị
- ☁️ **Serverless**: Deploy trên Cloudflare Workers, không cần server

## Cài đặt

```bash
# Clone repository
git clone https://github.com/AITT-VN/wiki-app.git
cd wiki-app

# Cài đặt dependencies
npm install

# Tạo file .env.local
cp .env.example .env.local
# Sửa MINIMAX_API_KEY trong .env.local

# Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem wiki.

## Cấu trúc thư mục

```
wiki-app/
├── app/                      # Next.js App Router
│   ├── layout.jsx            # Root layout (Nextra theme)
│   ├── [[...mdxPath]]/       # Catch-all MDX route
│   │   └── page.jsx
│   └── api/ai/ask/           # AI Q&A API endpoint
│       └── route.js
├── components/               # React components
│   ├── AskAI.jsx             # AI chat widget
│   └── AskAI.css
├── content/                  # Wiki content (Markdown/MDX)
│   ├── _meta.js              # Navigation config
│   ├── index.mdx             # Homepage
│   ├── getting-started.mdx
│   └── products/
│       ├── _meta.js
│       ├── yolo-bit.mdx
│       └── xbot.mdx
├── lib/                      # Utilities
│   └── wiki-context.js       # RAG context builder
├── next.config.mjs
├── mdx-components.jsx
└── package.json
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
4. Nội dung mới sẽ tự động xuất hiện trong câu trả lời AI

## API cho bên thứ 3

Ứng dụng khác (LMS, Mobile App) có thể gọi API:

```bash
curl -X POST https://wiki.ohstem.vn/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Yolo:Bit là gì?"}'
```

## Deploy lên Cloudflare

Site chạy trên **Cloudflare Workers** qua adapter [OpenNext](https://opennext.js.org/cloudflare).
Toàn bộ trang wiki được build sẵn và phục vụ từ static assets; Worker chỉ chạy
API AI chat.

### Lần đầu

```bash
npx wrangler login

# Secrets (mỗi lệnh sẽ hỏi giá trị)
npx wrangler secret put MINIMAX_API_KEY
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put GOOGLE_SHEETS_WEBHOOK_URL
npx wrangler secret put GOOGLE_SHEETS_WEBHOOK_SECRET
```

Biến không bí mật (`MINIMAX_MODEL`, `GEMINI_MODEL`) nằm trong `vars` của [wrangler.jsonc](wrangler.jsonc).

### Deploy

```bash
npm run deploy     # build + deploy lên Cloudflare
npm run preview    # build + chạy thử Worker ở local (cần file .dev.vars, xem .dev.vars.example)
```

Hoặc nối repo GitHub với **Workers Builds** trong dashboard Cloudflare
(Build command: `npx opennextjs-cloudflare build`, Deploy command: `npx opennextjs-cloudflare deploy`),
khi đó secrets đặt trong *Settings → Variables and Secrets* của Worker.

### Lưu ý

- **Admin CMS và Keystatic chỉ có ở local** (`npm run dev`, mở `/admin` hoặc `/keystatic`).
  Các file route của chúng có đuôi `.admin.js` / `.admin.jsx` (kể cả `middleware.admin.js`),
  chỉ dev server mới nhận; bản build lên Cloudflare không có các trang này.
  Sửa bài xong thì commit và deploy lại.
- Nội dung cho trợ lý AI được chụp lại lúc build vào `public/_wiki/pages.json`
  (script `scripts/build-wiki-index.mjs`, tự chạy trước `dev` và `build`).
- Luôn deploy bằng `npm run deploy` (không chạy `wrangler deploy` trực tiếp), vì bước build của
  OpenNext chép các trang đã render sẵn vào static assets.

## License

© 2025 OhStem Education. All rights reserved.
