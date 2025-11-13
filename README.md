RBAC/ABAC Security Demo - Node.js & React

1. Giới thiệu ngắn gọn về đề tài

Dự án này là một ứng dụng minh họa (Proof of Concept - PoC) nhằm so sánh hai mô hình kiểm soát truy cập phổ biến: Role-Based Access Control (RBAC) và Attribute-Based Access Control (ABAC) trong môi trường Node.js/Express.

Mục tiêu chính là cho thấy sự khác biệt giữa các Endpoint "Secure" (được bảo vệ bằng middleware RBAC/ABAC) và các Endpoint "Vulnerable" (dễ bị tấn công, không có kiểm tra ủy quyền), giúp người dùng dễ dàng nhận thấy vai trò quan trọng của bảo mật ủy quyền.

2. Công nghệ sử dụng

Công nghệ

Loại

Chi tiết

Backend

Ngôn ngữ

Node.js



Framework

Express.js



Database

MongoDB (qua Mongoose)



Bảo mật

jsonwebtoken, bcryptjs

Frontend

Thư viện

React (Sử dụng Functional Components & Hooks)



Styling

Tailwind CSS (tải qua CDN)



Icon

Lucide React

3. Cấu trúc thư mục dự án

.
├── node_modules/
├── .env                  # File cấu hình biến môi trường
├── package.json
├── package-lock.json
├── app.js                # Server chính (sử dụng secure middleware)
├── vulnerable_app.js     # (Giả định) Server cũ không có bảo mật
├── seed.js               # Script tạo dữ liệu người dùng ban đầu
└── src/
    ├── models/
    │   └── User.js       # Schema người dùng (username, password, role, department)
    ├── middlewares/
    │   ├── auth.js       # Middleware xác thực JWT (authenticate)
    │   ├── rbac.js       # Middleware ủy quyền dựa trên vai trò (authorizeRole)
    │   └── abac.js       # Middleware ủy quyền dựa trên thuộc tính (authorizeDepartment)
    └── routes/
        └── resourceRoutes.js # Định nghĩa các API endpoint có bảo mật


4. Hướng dẫn cài đặt & chạy chương trình

4.1. Yêu cầu môi trường

Node.js: Phiên bản 18+

MongoDB: Local hoặc cloud instance (MongoDB Atlas)

4.2. Cấu hình file .env

Tạo file .env ở thư mục gốc của dự án và điền thông tin cấu hình:

# Kết nối MongoDB
MONGO_URI=mongodb://localhost:27017/security_demo_db

# Khóa bí mật JWT (thay đổi giá trị này)
JWT_SECRET=your_super_secret_jwt_key

# Cổng chạy Server
PORT=3000


4.3. Cài đặt dependency và Database

Cài đặt các gói phụ thuộc:

npm install express mongoose jsonwebtoken bcryptjs dotenv cors


Tạo dữ liệu demo (Seeding):
Chạy script seed.js để tạo các tài khoản demo:

node seed.js


4.4. Lệnh chạy hệ thống

Chạy server Node.js (sử dụng app.js được bảo mật):

node app.js
# Hoặc dùng nodemon nếu đã cài:
# nodemon app.js


Kiểm tra terminal, bạn sẽ thấy thông báo: ✅ Secure server running on port 3000.

5. Tài khoản demo để đăng nhập

Sử dụng các tài khoản này để kiểm tra các chính sách bảo mật:

Username

Password

Role

Department

Mô tả

admin

123456

admin

IT

Có quyền truy cập Admin (RBAC) và IT (ABAC)

user2

123456

user

IT

KHÔNG có quyền Admin, CÓ quyền truy cập IT (ABAC)

user1

123456

user

HR

KHÔNG có quyền Admin, KHÔNG có quyền truy cập IT

6. Kết quả và hình ảnh minh họa giao diện

Giao diện frontend SecurityDemo.jsx cho phép kiểm tra các trường hợp truy cập khác nhau:

Giao diện đăng nhập và thông tin người dùng

Kết quả Test Secure Endpoint (Thành công - 200 OK)

Tài khoản: admin (Role: admin)

Endpoint: Admin Resource (RBAC)

Kết quả: Truy cập thành công do thỏa mãn chính sách RBAC.

Kết quả Test Secure Endpoint (Từ chối - 403 Forbidden)

Tài khoản: user1 (Department: HR)

Endpoint: IT Department Resource (ABAC)

Kết quả: Bị từ chối (403 Forbidden) do không thỏa mãn chính sách ABAC (req.user.department !== "IT").

Kết quả Test Vulnerable Endpoint (Luôn thành công - 200 OK)

Tài khoản: Bất kỳ người dùng nào có token (kể cả user1, role: user)

Endpoint: Admin Resource (VULNERABLE)

Kết quả: Luôn thành công (200 OK) vì endpoint không có middleware bảo mật, chứng minh lỗ hổng.
