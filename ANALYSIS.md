# 1) Tác nhân và Use Case

## Tác nhân
- Quản trị hệ thống (Admin)
- Thủ thư (Librarian)
- Độc giả (Sinh viên, thao tác thông qua thủ thư)

## Use Case theo tác nhân
- Admin:
  - Đăng nhập
  - Tạo tài khoản thủ thư
  - Cấp quyền (admin/librarian)
  - Sửa thông tin nhân viên
  - Xóa nhân viên
- Librarian:
  - Đăng nhập
  - Quản lý thẻ độc giả (thêm/sửa/xóa)
  - Quản lý chuyên ngành (thêm/sửa/xóa)
  - Quản lý đầu sách (thêm/sửa/xóa)
  - Quản lý bản sao sách (thêm/sửa/xóa)
  - Lập phiếu mượn
  - Ghi nhận trả sách
  - Xem báo cáo thống kê
- Độc giả:
  - Đăng ký thẻ thư viện
  - Mượn sách
  - Trả sách

# 2) Số trang UI cần thiết
- Login
- Dashboard
- Quản lý độc giả
- Quản lý chuyên ngành
- Quản lý đầu sách
- Quản lý bản sao sách
- Quản lý mượn/trả
- Báo cáo thống kê
- Quản lý người dùng hệ thống (admin)

Tổng: 9 màn hình

# 3) Bảng phân tích nghiệp vụ

| Nhóm | Đầu vào | Xử lý | Đầu ra |
|---|---|---|---|
| Quản lý độc giả | Mã độc giả, tên, lớp, ngày sinh, giới tính | Kiểm tra trùng mã, lưu cơ sở dữ liệu | Danh sách độc giả |
| Quản lý sách | Dữ liệu đầu sách và bản sao | Cập nhật tồn kho theo bản sao | Danh mục sách/chuyên ngành |
| Mượn sách | Mã sách, mã độc giả, ngày mượn | Kiểm tra độc giả có đang mượn sách hay không; cập nhật trạng thái sách | Phiếu mượn |
| Trả sách | Mã phiếu, ngày trả, tình trạng trả | Tính quá hạn >14 ngày; cập nhật trạng thái sách | Phiếu trả |
| Báo cáo | Dữ liệu giao dịch mượn/trả | Tổng hợp TOP đầu sách, độc giả chưa trả | Bảng báo cáo |
| Quản lý người dùng | user/pass/role | Xác thực JWT, kiểm tra quyền theo vai trò | Danh sách người dùng hệ thống |

# 4) Prompt kỹ thuật mẫu để dùng AI-tools

## Prompt 1 - Sinh backend
"Hãy tạo backend FastAPI cho hệ thống quản lý thư viện trường đại học với SQLite. Gồm các module users/readers/categories/titles/copies/loans/reports. Bắt buộc JWT login, role admin/librarian, quy tắc 1 độc giả chỉ được mượn 1 sách tại 1 thời điểm, API báo cáo top đầu sách và độc giả chưa trả."

## Prompt 2 - Sinh frontend
"Hãy tạo frontend React + Vite cho backend FastAPI đã có. Cần các trang login, dashboard, CRUD readers/categories/titles/copies/users, màn hình loans và reports. Dùng axios, react-router, lưu JWT token localStorage, route guard theo token."

## Prompt 3 - Sửa lỗi do AI sinh
"Hãy chạy build frontend, chạy startup backend, đọc log lỗi, sửa theo thứ tự: lỗi import, lỗi API path, lỗi kiểu dữ liệu form date/boolean, lỗi role permission. Mỗi lần sửa xong chạy lại đến khi pass."

# 5) Workflow MVP -> Iteration -> Product Improvement

## MVP
- Hoàn tất đăng nhập
- CRUD dữ liệu chính
- Mượn/trả có ràng buộc
- Báo cáo có 2 thống kê cơ bản

## Iteration 1
- Tách component frontend tái sử dụng
- Bổ sung validate form
- Bổ sung thông báo lỗi UI

## Iteration 2
- Nâng cao báo cáo theo khoảng thời gian
- Lọc/tìm kiếm danh sách
- Thêm xuất báo cáo CSV/PDF

## Product Improvement
- Soft delete + audit log
- Multi-role chi tiết hơn
- Tích hợp quét mã vạch
- Deploy cloud + backup DB

# 6) Teamworking đề xuất
- Thành viên A: Backend auth + users + readers
- Thành viên B: Backend books + copies + loans + reports
- Thành viên C: Frontend auth + layout + CRUD pages
- Thành viên D: Frontend loans + reports + test + docs
- Làm việc theo sprint 3-5 ngày, review PR chéo giữa các thành viên
