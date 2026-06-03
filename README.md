# 🎵 ZEN AUDIO

Một ứng dụng web nghe nhạc trực tuyến hiện đại và trực quan hóa âm thanh chuyên nghiệp (Music Streaming & Audio Visualizer Platform), được xây dựng trên nền tảng **React (Vite)**, **Tailwind CSS v4** và hệ thống quản lý âm thanh nâng cao.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### Frontend (`/ZENAUDIO`)
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4 (sử dụng `@tailwindcss/vite` & `@tailwindcss/postcss`)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **State Management:** React Context API (quản lý trạng thái trình phát nhạc và trực quan sóng âm)

### Backend (Dự kiến tại gốc hoặc máy chủ liên kết)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Security:** JSON Web Token (JWT) cho Authentication & BcryptJS để mã hóa mật khẩu.

---

## 📂 Cấu Trúc Dự Án (Project Structure)

Dự án hiện tại được chia thành cấu trúc như sau:

```text
ZEN AUDIO/ (Thư mục gốc)
├── ZENAUDIO/                     # Source Code Frontend (React + Vite)
│   ├── src/
│   │   ├── api/                  # Cấu hình gọi API (axiosInstance.js)
│   │   ├── components/           # Các component giao diện chính
│   │   │   ├── Artist/           # Trang nghệ sĩ, danh sách bài hát nổi bật, AlbumGrid
│   │   │   ├── Auth/             # Form Đăng nhập & Đăng ký người dùng
│   │   │   ├── Layout/           # Sidebar, PlayerBar, PlayerBarStudio, RightPanel
│   │   │   ├── Library/          # Quản lý thư viện nhạc cá nhân, CollectionCard
│   │   │   ├── Search/           # Tìm kiếm thông minh với Bento Grid thiết kế đẹp mắt
│   │   │   └── Studio/           # Dashboard phòng thu chuyên nghiệp (Equalizer, Visualizer, Analytics)
│   │   ├── context/              # Quản lý AudioContext và PlayerContext toàn cục
│   │   ├── hooks/                # Custom hooks xử lý sóng âm (useAudioVisualizer.js)
│   │   ├── App.jsx               # Component gốc quản lý Route chính
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore                    # Cấu hình bỏ qua các file rác/thư mục nặng khi đẩy lên Git
├── package.json                  # Cấu hình phụ thuộc ở thư mục gốc (BcryptJS, JWT, v.v.)
└── README.md                     # File hướng dẫn này
```

---

## 🌟 Tính Năng Nổi Bật (Key Features)

1. **Dashboard Phòng Thu Âm Thanh (Studio Dashboard):**
   - Bộ trực quan hóa tần số âm thanh chuyên nghiệp (Phase Correlation, Bit Depth Analytics).
   - Bộ chỉnh âm tần số (Equalizer Card) thời gian thực.
   - Các hiệu ứng nhấp nháy công nghệ cao (Tech Flicker Card) tạo cảm giác cực kỳ Premium và Tech-centric.
2. **Hệ Thống Player Context Toàn Cục:**
   - Điều khiển bài nhạc (Play, Pause, Skip, Volume, Seek) liền mạch xuyên suốt toàn ứng dụng qua React Context.
   - Sử dụng Web Audio API để đồng bộ trực quan sóng âm (Visualizer) từ nhạc đang phát.
3. **Tìm Kiếm Đa Dạng (Bento Grid Search):**
   - Thiết kế giao diện tìm kiếm dạng lưới Bento phong cách Apple/Modern UI.
   - Phân loại danh mục nhạc trực quan.
4. **Trang Nghệ Sĩ Chuyên Nghiệp (Artist Page):**
   - Hiển thị bài hát phổ biến, danh sách Album dạng lưới, thông tin bên lề (sidebar) và ảnh bìa nghệ sĩ sống động.
5. **Đăng Ký & Đăng Nhập:**
   - Quản lý phiên đăng nhập và lưu trữ mã bảo mật Token JWT tự động chèn vào header trong mọi yêu cầu API.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- Đã cài đặt **Node.js** (v18.x trở lên được khuyến nghị)
- Đã cài đặt **npm** hoặc **yarn**

### Các Bước Chạy Frontend
1. Mở terminal và di chuyển vào thư mục frontend:
   ```bash
   cd ZENAUDIO
   ```
2. Cài đặt các gói thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi động môi trường phát triển (Local Server):
   ```bash
   npm run dev
   ```
   *Giao diện của bạn sẽ chạy tại địa chỉ mặc định:* `http://localhost:5173`

---

## 📝 Bản Quyền (License)
Dự án được phân phối dưới giấy phép **ISC License**.
