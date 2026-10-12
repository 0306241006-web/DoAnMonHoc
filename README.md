# HỆ THỐNG QUẢN LÝ GHI CHÚ VÀ THÔNG TIN RIÊNG TƯ

Đồ án môn học Frontend.

## 1. Thành viên và phân công

| Họ tên | MSSV | Vai trò |
|---|---|---|
|Lê Khánh Đăng| 0306241021 | PM / Kiểm thử |
|Bùi Minh Duy| 0306241011 | Frontend |
|Lê Nguyễn Trọng Bảo | 0306241006 | Backend |

## 2. Chức năng

- Quản lý tên hiển thị và giao diện sáng/tối.
- Thiết lập mật khẩu cho khu vực riêng tư.
- Thêm, xem, sửa, xóa ghi chú theo chủ đề:
  Học tập, Công việc, Cá nhân.
- Nhập mật khẩu để mở giao diện ghi chú riêng tư.
- Thêm, xem, sửa, xóa ghi chú riêng tư.
- Khóa lại khu vực riêng tư khi tải lại trang.
- Lưu dữ liệu bằng file JSON.

## 3. Công nghệ sử dụng

- Frontend: React, Vite, React Router, CSS.
- Backend: Node.js, Express, CORS.
- Lưu trữ: file JSON và module fs của Node.js.
- Quản lý mã nguồn: Git và GitHub.

## 4. Cấu trúc dự án

- backend/server.js: API và xử lý dữ liệu.
- backend/data/profile.json: cấu hình người dùng.
- backend/data/notes/: ghi chú theo chủ đề.
- backend/data/private.json: ghi chú riêng tư.
- frontend/src/: mã nguồn giao diện React.

## 5. Hướng dẫn chạy

Cài đặt Node.js bản LTS còn được hỗ trợ và npm.
Mở thư mục dự án chứa backend và frontend trong VS Code.

### Chạy Backend — Terminal thứ nhất

```bash
cd backend
npm install
npm start
```

Backend chạy tại: http://localhost:5000

### Chạy Frontend — Terminal thứ hai

Mở Terminal mới tại thư mục gốc dự án:

```bash
cd frontend
npm install
npm run dev
```

Mở đường link Vite hiển thị trong Terminal,
thường là: http://localhost:5173

Giữ cả hai Terminal hoạt động trong lúc sử dụng web.
Nhấn Ctrl + C tại mỗi Terminal để dừng.

## 6. Dữ liệu và mật khẩu demo

- Dữ liệu được lưu trong backend/data.
- Bản dữ liệu hiện tại có mật khẩu demo: 123456.
- Có thể đổi mật khẩu trong trang Cài đặt.
- Không xóa thư mục dữ liệu khi đang sử dụng ứng dụng.

## 7. Giới hạn của bản demo

- Mật khẩu đang lưu dạng văn bản thường.
- API Profile hiện trả về cả mật khẩu.
- Khu vực riêng tư mới được khóa ở giao diện;
  các API ghi chú riêng tư chưa kiểm tra phiên xác thực.
- Chỉ sử dụng dữ liệu mẫu cho bài thực hành.

## 8. Tài liệu nhóm

- Trello: bổ sung liên kết.
- Figma: bổ sung liên kết.
- Bảng kiểm thử: bổ sung liên kết.
