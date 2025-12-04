# 🎯 Hướng dẫn Demo Attack Simulation

## 📋 Tổng quan

Demo này mô phỏng một kịch bản tấn công thực tế để chứng minh tầm quan trọng của RBAC/ABAC trong bảo mật hệ thống.

### Kịch bản:
- **Attacker**: Một người dùng có tài khoản hợp lệ (username + password)
- **Đặc điểm**: Không có role admin, không thuộc department nào, clearance level thấp nhất
- **Mục tiêu**: Truy cập trái phép vào dữ liệu nhạy cảm
- **So sánh**: Hệ thống vulnerable (không bảo vệ) vs Secure (có RBAC/ABAC)

---

## 🚀 Cách chạy Demo (3 bước)

### Bước 1: Chuẩn bị môi trường

```bash
# Đảm bảo MongoDB đang chạy
# Nếu dùng MongoDB Atlas, kiểm tra connection string trong .env

# Cài đặt dependencies cho attack-simulation
cd attack-simulation
npm install

# Tạo attacker user trong database
npm run seed
```

**Kết quả mong đợi:**
```
✅ Attacker user created successfully!

📋 Attacker Profile:
   Username: attacker
   Password: attacker123
   Role: user (not admin)
   Department: null (no department)
   Clearance: public (lowest level)
```

### Bước 2: Khởi động Backend Servers

**Terminal 1 - Vulnerable Backend (Port 5001):**
```bash
cd backend_vulnerable
npm install  # Nếu chưa cài
npm start
```

**Terminal 2 - Secure Backend (Port 5002):**
```bash
cd backend_secure
npm install  # Nếu chưa cài
npm start
```

**Kiểm tra servers đã chạy:**
- Vulnerable: http://localhost:5001
- Secure: http://localhost:5002

### Bước 3: Chạy Attack Simulation

**Terminal 3:**
```bash
cd attack-simulation
npm run attack
```

---

## 📊 Kết quả Demo

### 🔓 Vulnerable System - KHÔNG có RBAC/ABAC

```
═══════════════════════════════════════════════════════════════════════════════
  🔓 ATTACKING VULNERABLE SYSTEM (No RBAC/ABAC)
═══════════════════════════════════════════════════════════════════════════════

✓ Logged in successfully

📊 Attack Results on Vulnerable System:

✓ Admin Resource: DATA STOLEN!
  → { "message": "Welcome, admin! (VULNERABLE: No Role Check)" }

✓ Department Resource: DATA STOLEN!
  → { "message": "Welcome to IT department, attacker (VULNERABLE: No Dept Check)" }

✓ Top Secret Data: DATA STOLEN!
  → { "message": "TOP SECRET DATA: Alien existence confirmed. (VULNERABLE: Leaked!)" }

✓ Secret Data: DATA STOLEN!
  → { "message": "SECRET DATA: The cake is a lie. (VULNERABLE: Leaked!)" }

✓ Work Hours Resource: DATA STOLEN!
  → { "message": "You are accessing this resource during working hours. (VULNERABLE: Always Open)" }

✓ Office IP Resource: DATA STOLEN!
  → { "message": "You are accessing this from a trusted Office IP. (VULNERABLE: Any IP Allowed)" }

🚨 VULNERABLE SYSTEM BREACH SUMMARY:
   6/6 resources compromised!
   Success Rate: 100.0%
```

### 🔒 Secure System - CÓ RBAC/ABAC

```
═══════════════════════════════════════════════════════════════════════════════
  🔒 ATTACKING SECURE SYSTEM (With RBAC/ABAC)
═══════════════════════════════════════════════════════════════════════════════

✓ Logged in successfully

📊 Attack Results on Secure System:

✓ Admin Resource: PROTECTED!
  → {
    "message": "Access denied: insufficient role",
    "policy": "RoleCheck",
    "required": "admin",
    "current": "user"
  }

✓ Department Resource: PROTECTED!
  → {
    "message": "Access denied: department mismatch",
    "policy": "DepartmentCheck",
    "required": "IT",
    "current": null
  }

✓ Top Secret Data: PROTECTED!
  → {
    "message": "Access denied: Insufficient Clearance",
    "policy": "ClearanceCheck",
    "required": "top_secret",
    "current": "public"
  }

✓ Secret Data: PROTECTED!
  → {
    "message": "Access denied: Insufficient Clearance",
    "policy": "ClearanceCheck",
    "required": "secret",
    "current": "public"
  }

✓ Work Hours Resource: PROTECTED!
  → {
    "message": "Access denied: Outside allowed hours",
    "policy": "TimeRestriction",
    "required": "9:00 - 18:00",
    "current": "22:00"
  }

✓ Office IP Resource: PROTECTED!
  → {
    "message": "Access denied: Invalid IP Address",
    "policy": "IPRestriction",
    "required": ["127.0.0.1", "::1", "::ffff:127.0.0.1"],
    "current": "192.168.1.100"
  }

✅ SECURE SYSTEM DEFENSE SUMMARY:
   6/6 resources protected!
   Defense Rate: 100.0%
```

---

## 🎓 Phân tích kết quả

### ❌ Vấn đề của Vulnerable System:

1. **Chỉ kiểm tra Authentication** (có token hợp lệ)
2. **Không kiểm tra Authorization** (quyền truy cập)
3. **Bất kỳ user nào đăng nhập** đều truy cập được mọi resource
4. **Dữ liệu nhạy cảm bị lộ** 100%

### ✅ Ưu điểm của Secure System:

1. **RBAC - Role-Based Access Control:**
   - Kiểm tra role của user (admin, user, etc.)
   - Chặn user thường truy cập admin resources

2. **ABAC - Attribute-Based Access Control:**
   - **Department**: Chỉ IT department truy cập IT resources
   - **Clearance Level**: Top Secret > Secret > Confidential > Public
   - **Time Policy**: Chỉ trong giờ làm việc (9h-18h)
   - **IP Policy**: Chỉ từ IP được phép

3. **Audit Logging:**
   - Ghi lại mọi lần truy cập (thành công/thất bại)
   - Theo dõi các lần tấn công
   - Phân tích hành vi bất thường

---

## 🔍 Kiểm tra Audit Logs

Sau khi chạy attack simulation, xem audit logs:

```bash
curl http://localhost:5002/api/logs
```

**Kết quả mẫu:**
```json
[
  {
    "timestamp": "2025-12-04T13:45:23.456Z",
    "user": "attacker",
    "resource": "Admin Resource",
    "action": "ACCESS",
    "result": "DENIED",
    "reason": "Insufficient role",
    "policy": "RBAC-Role"
  },
  {
    "timestamp": "2025-12-04T13:45:23.789Z",
    "user": "attacker",
    "resource": "Department Resource (IT)",
    "action": "ACCESS",
    "result": "DENIED",
    "reason": "Department mismatch",
    "policy": "ABAC-Dept"
  }
  // ... more logs
]
```

---

## 📈 Tạo Report JSON

Để tạo report dạng JSON cho phân tích:

```bash
cd attack-simulation
npm run report
```

File `attack-report.json` sẽ được tạo với cấu trúc:

```json
{
  "timestamp": "2025-12-04T13:45:23.456Z",
  "attacker": "attacker",
  "vulnerable": {
    "successCount": 6,
    "results": [...]
  },
  "secure": {
    "successCount": 0,
    "results": [...]
  }
}
```

---

## 🎬 Demo cho Presentation

### Cách 1: Chạy tự động (PowerShell)

```powershell
# Từ thư mục gốc project
.\run-attack-demo.ps1
```

Script này sẽ:
1. Mở 2 terminal cho 2 backend servers
2. Chạy attack simulation
3. Hiển thị kết quả so sánh

### Cách 2: Chạy thủ công (Chi tiết hơn)

Làm theo 3 bước ở trên để có thể giải thích từng bước.

---

## 💡 Điểm nhấn khi Demo

1. **Khởi đầu:**
   - Giới thiệu attacker profile (không có quyền gì)
   - Mục tiêu: Đánh cắp dữ liệu nhạy cảm

2. **Vulnerable System:**
   - Chỉ cần đăng nhập thành công
   - Truy cập được MỌI resource
   - 100% dữ liệu bị lộ

3. **Secure System:**
   - Đăng nhập thành công nhưng...
   - Mọi truy cập đều bị chặn
   - Lý do rõ ràng: role, department, clearance, time, IP

4. **Kết luận:**
   - Authentication ≠ Authorization
   - RBAC + ABAC = Defense in Depth
   - Audit Logging để phát hiện tấn công

---

## 🚨 Lưu ý quan trọng

1. **MongoDB phải chạy** trước khi start backends
2. **Port conflicts**: Đảm bảo port 5001 và 5002 không bị chiếm
3. **Seed attacker**: Chạy `npm run seed` trước khi attack
4. **Time policy**: Nếu test ngoài giờ 9h-18h, time-based attack sẽ bị chặn (đúng như mong đợi)

---

## 📚 Tài liệu tham khảo

- [OWASP Access Control](https://owasp.org/www-community/Access_Control)
- [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control)
- [XACML ABAC](http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html)

---

## 🎯 Mở rộng

Có thể mở rộng demo bằng cách:

1. **Thêm attack vectors:**
   - JWT token manipulation
   - SQL Injection attempts
   - Brute force attacks

2. **Thêm defense mechanisms:**
   - Rate limiting
   - IP blacklisting
   - Anomaly detection

3. **Visualization:**
   - Real-time dashboard
   - Attack heatmap
   - Charts và graphs
