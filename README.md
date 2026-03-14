# Library Management System - FastAPI + React Vite
## Thông Tin Nhóm

**Nhóm**

- Thành viên 1: Huỳnh Nhật Hào - 23663871  
- Thành viên 2: Lê Trung Hữu - 23666491  
- Thành viên 3: Phan Gia Huy - 23674141  
- Thành viên 4: Trần Quốc Huy - 23637731

  
## Stack
- Backend: FastAPI + SQLAlchemy + SQLite + JWT
- Frontend: React + Vite + React Router + Axios

## Chức năng
- Đăng nhập hệ thống
- Quản lý độc giả (CRUD)
- Quản lý chuyên ngành (CRUD)
- Quản lý đầu sách (CRUD)
- Quản lý bản sao sách (CRUD)
- Quản lý mượn/trả sách theo quy tắc 1 độc giả mượn 1 sách tại 1 thời điểm
- Báo cáo: đầu sách mượn nhiều, độc giả chưa trả sách
- Quản lý tài khoản thủ thư (admin)

## Tài khoản mặc định
- Username: admin
- Password: admin123

## Chạy code nhanh (PowerShell)

### Lần đầu tiên
1. Mở Terminal 1:
```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
2. Mở Terminal 2:
```powershell
cd frontend
npm install
npm run dev
```
3. Mở trình duyệt tại: http://localhost:5173

### Các lần sau
1. Terminal 1:
```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```
2. Terminal 2:
```powershell
cd frontend
npm run dev
```

### Đăng nhập nhanh
- Username: admin
- Password: admin123

## Chạy backend
1. Di chuyển vào thư mục backend
2. Cài dependencies: `pip install -r requirements.txt`
3. Chạy API: `uvicorn app.main:app --reload --port 8000`

## Chạy frontend
1. Di chuyển vào thư mục frontend
2. Cài dependencies: `npm install`
3. Chạy dev: `npm run dev`
4. Truy cập: http://localhost:5173

## Kiểm thử nhanh
1. Đăng nhập bằng admin/admin123
2. Tạo chuyên ngành, đầu sách, bản sao, độc giả
3. Tạo phiếu mượn
4. Trả sách
5. Xem báo cáo

## Lỗi thường gặp và cách xử lý nhanh

1. Lỗi `ModuleNotFoundError: No module named 'app'` khi chạy backend
- Nguyên nhân: chạy sai thư mục/module path.
- Cách sửa:
  - Nếu đang ở root project: `python -m uvicorn app.main:app --app-dir backend --port 8000 --reload`
  - Nếu đã `cd backend`: `uvicorn app.main:app --reload --port 8000`

2. Lỗi bcrypt/passlib (`module 'bcrypt' has no attribute '__about__'`)
- Nguyên nhân: xung đột version giữa `passlib` và `bcrypt` mới.
- Cách sửa:
  - Đảm bảo trong `backend/requirements.txt` có dòng: `bcrypt==4.0.1`
  - Cài lại: `pip install -r requirements.txt`

3. IDE báo đỏ import `fastapi`, `sqlalchemy`, `pydantic`
- Nguyên nhân: VS Code đang chọn sai Python Interpreter.
- Cách sửa:
  - Chọn lại interpreter đúng (Python 3.13 đã cài package).
  - Chạy lại: `pip install -r backend/requirements.txt`

4. Frontend không gọi được backend (Network/CORS)
- Kiểm tra backend đang chạy cổng `8000`.
- Kiểm tra frontend đang chạy cổng `5173`.
- Kiểm tra `baseURL` trong `frontend/src/api/client.js` là `http://localhost:8000`.

5. Lỗi 401 Unauthorized khi vào trang sau đăng nhập
- Nguyên nhân: token hết hạn hoặc token lỗi trong localStorage.
- Cách sửa nhanh: đăng xuất, xóa token cũ, đăng nhập lại.
