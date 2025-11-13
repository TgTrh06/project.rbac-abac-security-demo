# RBAC / ABAC Security Demo — Node.js (Express) + React (Vite)

## 1. Giới thiệu ngắn gọn
Dự án này là một **proof-of-concept (PoC)** minh họa hai mô hình kiểm soát truy cập phổ biến:

- **RBAC (Role-Based Access Control)** — phân quyền dựa trên vai trò.
- **ABAC (Attribute-Based Access Control)** — phân quyền dựa trên thuộc tính (ví dụ: owner, department).

Ứng dụng gồm hai bản backend:
- `backend_secure`: thực thi kiểm tra JWT, tra cứu user từ DB, áp dụng RBAC + ABAC.
- `backend_vulnerable`: demo lỗ hổng (tin role từ token / phát token dựa trên input client).

Frontend cung cấp 2 tab để so sánh hành vi giữa hai backend.

---

## 2. Công nghệ sử dụng

**Backend**
- Node.js (ESM / `type: "module"`)
- Express.js
- MongoDB (Mongoose)
- jsonwebtoken, bcryptjs, dotenv, cors

**Frontend**
- React (Vite)
- Zustand (tùy chọn)
- Tailwind CSS (tùy chọn)
- Vite

---

## 3. Cấu trúc thư mục dự án (giải thích)
```
security-rbac-abac/
├─ backend_secure/            # Backend an toàn (RBAC + ABAC)
│  ├─ models/                 # Mongoose model (User...)
│  ├─ middlewares/            # auth.js, rbac.js, abac.js (secure)
│  ├─ routes/                 # resource routes (protected)
│  ├─ seed/                   # seedUsers.js
│  ├─ server.js
│  └─ package.json
│
├─ backend_vulnerable/        # Backend có lỗ hổng (demo exploit)
│  ├─ middlewares/            # auth.js (vulnerable)
│  ├─ routes/
│  ├─ server.js
│  └─ package.json
│
├─ frontend/                  # React + Vite frontend (2 tabs)
│  ├─ src/
│  ├─ index.html
│  └─ package.json
│
├─ docs/
│  └─ PoC.md
├─ db/
│  └─ sample_users.json
├─ mongodump-export/          # (khi bạn chạy mongodump)
├─ .gitignore
└─ README.md
```

---

## 4. Yêu cầu môi trường
- Node.js >= 16 (khuyến nghị Node 18+)
- npm >= 8
- MongoDB (local hoặc Atlas)
- (Nếu dùng Tailwind) postcss, autoprefixer

---

## 5. Cài đặt & chạy chương trình

### 5.1. Clone và chuẩn bị
```bash
git clone <your-repo-url>
cd security-rbac-abac
```

### 5.2. Backend secure (port 5001)
```bash
cd backend_secure
npm install
# tạo file .env (copy .env.example nếu có)
# ví dụ .env:
# PORT=5001
# MONGO_URI=mongodb://127.0.0.1:27017/security_rbac_abac_secure
# JWT_SECRET=your_secure_secret

cp .env.example .env || echo "Create .env manually"
npm run seed   # tạo user demo
npm start
# server chạy tại http://localhost:5001
```

### 5.3. Backend vulnerable (port 4000)
```bash
cd ../backend_vulnerable
npm install
# tạo .env nếu cần (PORT=4000)
node server.js
# server chạy tại http://localhost:4000
```

### 5.4. Frontend
```bash
cd ../frontend
npm install
npm run dev
# mở http://localhost:5173
```

---

## 6. Cách import/export database

### Seed (tạo dữ liệu mẫu)
Trong `backend_secure` đã có `seed/seedUsers.js`. Chạy:
```bash
cd backend_secure
npm run seed
```

### Xuất (mongodump)
```bash
mongodump --db=security_rbac_abac_secure --out=./mongodump-export
zip -r MaSV_TenDeTai_mongodump.zip mongodump-export
```

### Nhập lại (mongorestore)
```bash
mongorestore --db=security_rbac_abac_secure ./mongodump-export/security_rbac_abac_secure
```

### Nếu không có mongodump (mongoexport)
```bash
mongoexport --db=security_rbac_abac_secure --collection=users --out=users.json --jsonArray
mongoimport --db=security_rbac_abac_secure --collection=users --file=users.json --jsonArray
```

---

## 7. Cấu hình file kết nối DB (`.env`)
Tạo file `.env` trong mỗi backend (không commit .env):

**backend_secure/.env**
```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/security_rbac_abac_secure
JWT_SECRET=change_this_to_a_strong_secret
```

**backend_vulnerable/.env**
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/security_rbac_abac_vulnerable
JWT_SECRET=weaksecret
```

---

## 8. Lệnh chạy hệ thống (tóm tắt)
- Cài dependencies: `npm install`
- Seed dữ liệu: `npm run seed`
- Chạy backend secure: `npm start` (trong backend_secure)
- Chạy backend vulnerable: `node server.js` (trong backend_vulnerable)
- Chạy frontend: `npm run dev` (trong frontend)

---

## 9. Tài khoản demo (seeded)
| Role    | Username | Password     |
|--------:|---------:|--------------|
| admin   | admin    | 123456       |
| user    | user1    | 123456       |
| user    | user2    | 123456       |

---

## 10. Kết quả & ảnh minh họa (hướng dẫn)
Bạn cần chụp **3–5 ảnh** và lưu vào `docs/screenshots/` (tạo folder nếu cần). Những ảnh nên bao gồm:

1. `login_admin_secure.png` — màn hình login (secure) và token nhận được.
2. `access_admin_secure_ok.png` — kết quả truy cập endpoint admin (200 OK).
3. `access_department_secure_forbidden.png` — user không có department bị trả 403.
4. `vulnerable_login_admin_fake.png` — dùng vulnerable login (chọn role=admin) nhận token admin.
5. `vulnerable_delete_success.png` — gọi DELETE trên vulnerable backend với token giả → thành công.

Ví dụ chèn ảnh vào README:
```md
![Login admin secure](docs/screenshots/login_admin_secure.png)
```

---

## 11. Ghi chú bảo mật & khuyến nghị
- **Không tin role trong token**: token chỉ nên chứa `sub`/`id`; server phải load user từ DB để quyết định quyền.
- Sử dụng **short-lived JWT** + refresh tokens.
- Lưu logs cho hành động nhạy cảm (audit).
- Quản lý secret (JWT_SECRET) bằng Secret Manager trong production.
- Áp dụng ABAC để kiểm tra owner/department khi cần.

---

## 12. .gitignore (gợi ý)
```
node_modules/
.env
npm-debug.log
mongodump-export/
docs/screenshots/*
```

---

## 13. Ghi chú nộp bài
- Nộp **Link Git** public (không include node_modules, .env).
- Nộp **mongodump-export** folder (nén zip) hoặc `users.json` nếu dùng mongoexport.
- Nộp `README.md` (file này) và ảnh minh họa trong `docs/screenshots/`.

---
