# Group2-AI1901 - Triết học và đời sống

Ứng dụng học tập React/Vite cho môn Triết học Mác - Lênin, gồm:

- Trang nội dung kiến thức theo chủ đề.
- Quiz luyện tập trắc nghiệm.
- Flip Card Game để ôn khái niệm.
- Trang tử vi vui có tích hợp Gemini API khi cấu hình `VITE_GEMINI_API_KEY`.

## Chạy dự án

```bash
npm install
npm run dev
```

## Kết nối Gemini API key

1. Vào [Google AI Studio API keys](https://ai.google.dev/gemini-api/docs/api-key) và tạo API key.
2. Tạo file `.env` ở thư mục gốc dự án, có thể dựa theo `.env.example`.
3. Điền key theo dạng:

```bash
VITE_GEMINI_API_KEY=AIza...
```

4. Dừng dev server rồi chạy lại `npm run dev` để Vite nạp biến môi trường mới.

Lưu ý: đây là app frontend nên key có thể bị lộ khi deploy public. Nếu dùng thật lâu dài, nên đưa phần gọi Gemini qua backend/serverless function và giới hạn key theo domain trong Google Cloud/AI Studio.

## Kiểm tra

```bash
npm run lint
npm run build
```

## Deploy web

Build production:

```bash
npm run build
npm run preview
```

Thư mục xuất bản là `dist`.

Deploy lên Vercel:

- Import repository vào Vercel.
- Framework preset: `Vite`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Environment Variables: thêm `VITE_GEMINI_API_KEY` nếu muốn bật phần Gemini.

Deploy lên Netlify:

- Import repository vào Netlify.
- Build command: `npm run build`.
- Publish directory: `dist`.
- Environment variables: thêm `VITE_GEMINI_API_KEY`.
- Nếu dùng route như `/courses`, `/quiz`, `/flip-card`, cần cấu hình SPA rewrite về `index.html`.

## Liên hệ

- Nhóm: Group2-AI1901
- Email: tranduytrung251105@gmail.com
- Điện thoại: 0822777349
- Facebook: https://www.facebook.com/trung.tran.678726?mibextid=wwXIfr
