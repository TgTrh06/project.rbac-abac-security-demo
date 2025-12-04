# 🎭 Attack Simulation Tool

Công cụ mô phỏng tấn công để demo sự khác biệt giữa hệ thống **có** và **không có** RBAC/ABAC.

## 🎯 Mục đích

Mô phỏng một kịch bản tấn công thực tế:
- **Attacker**: Người dùng có tài khoản hợp lệ nhưng **không có quyền** (no role, no department, no clearance)
- **Mục tiêu**: Đánh cắp dữ liệu nhạy cảm từ hệ thống
- **So sánh**: Kết quả tấn công trên hệ thống vulnerable vs secure

## 👤 Attacker Profile

```
Username: attacker
Password: attacker123
Role: user (không phải admin)
Department: null (không thuộc phòng ban nào)
Clearance: public (mức độ bảo mật thấp nhất)
```

## 🎬 Cách sử dụng

### Bước 1: Cài đặt dependencies

```bash
cd attack-simulation
npm install
```

### Bước 2: Seed attacker user vào database

```bash
npm run seed
```

Lệnh này sẽ tạo user `attacker` trong MongoDB với các đặc quyền tối thiểu.

### Bước 3: Chạy cả 2 backend servers

**Terminal 1 - Vulnerable Backend:**
```bash
cd ../backend_vulnerable
npm install
npm start
```

**Terminal 2 - Secure Backend:**
```bash
cd ../backend_secure
npm install
npm start
```

### Bước 4: Chạy attack simulation

```bash
npm run attack
```

## 📊 Kết quả mong đợi

### 🔓 Vulnerable System (Port 5001)
```
✓ Admin Resource: DATA STOLEN!
✓ Department Resource: DATA STOLEN!
✓ Top Secret Data: DATA STOLEN!
✓ Secret Data: DATA STOLEN!
✓ Work Hours Resource: DATA STOLEN!
✓ Office IP Resource: DATA STOLEN!

🚨 6/6 resources compromised! (100% success rate)
```

### 🔒 Secure System (Port 5002)
```
✓ Admin Resource: PROTECTED! (Role check failed)
✓ Department Resource: PROTECTED! (Department check failed)
✓ Top Secret Data: PROTECTED! (Clearance check failed)
✓ Secret Data: PROTECTED! (Clearance check failed)
✓ Work Hours Resource: PROTECTED! (Time policy failed)
✓ Office IP Resource: PROTECTED! (IP policy failed)

✅ 6/6 resources protected! (100% defense rate)
```

## 🎯 Attack Targets

| Endpoint | Protection Type | Description |
|----------|----------------|-------------|
| `/api/resource/admin` | RBAC - Role | Chỉ admin mới truy cập được |
| `/api/resource/department` | ABAC - Department | Chỉ IT department truy cập được |
| `/api/resource/top-secret` | ABAC - Clearance | Yêu cầu top_secret clearance |
| `/api/resource/secret` | ABAC - Clearance | Yêu cầu secret clearance |
| `/api/resource/work-hours` | ABAC - Time | Chỉ trong giờ làm việc (9h-18h) |
| `/api/resource/office-ip` | ABAC - IP | Chỉ từ IP được phép |

## 🔍 Chi tiết kỹ thuật

### Vulnerable System
- ❌ Không có RBAC middleware
- ❌ Không có ABAC policies
- ❌ Chỉ kiểm tra authentication (có token hợp lệ)
- ❌ Bất kỳ user nào đăng nhập đều truy cập được mọi resource

### Secure System
- ✅ RBAC middleware kiểm tra role
- ✅ ABAC policies kiểm tra:
  - Department (phòng ban)
  - Clearance Level (mức độ bảo mật)
  - Time (giờ làm việc)
  - IP Address (IP được phép)
- ✅ Audit logging ghi lại mọi lần truy cập
- ✅ Chặn và log các lần tấn công

## 📝 Audit Logs

Sau khi chạy attack simulation, kiểm tra audit logs:

```bash
curl http://localhost:5002/api/logs
```

Bạn sẽ thấy tất cả các lần attacker cố gắng truy cập bị chặn và ghi lại.

## 🎓 Học được gì?

1. **Authentication ≠ Authorization**
   - Có token hợp lệ không có nghĩa là có quyền truy cập mọi thứ
   
2. **RBAC quan trọng**
   - Kiểm tra role ngăn chặn user thường truy cập admin resources
   
3. **ABAC linh hoạt hơn**
   - Kiểm tra nhiều thuộc tính: department, clearance, time, IP
   - Có thể thay đổi policies động mà không cần sửa code

4. **Defense in Depth**
   - Kết hợp nhiều lớp bảo mật (RBAC + ABAC + Audit Logging)
   - Một lớp bị vượt qua, còn các lớp khác bảo vệ

## 🚀 Mở rộng

Bạn có thể mở rộng attack simulation bằng cách:

1. **Thêm attack vectors**:
   - SQL Injection attempts
   - JWT token manipulation
   - Brute force attacks
   - Session hijacking

2. **Thêm defense mechanisms**:
   - Rate limiting
   - IP blacklisting
   - Multi-factor authentication
   - Anomaly detection

3. **Visualization**:
   - Real-time attack dashboard
   - Attack heatmap
   - Success/failure charts

## ⚠️ Lưu ý

- Tool này chỉ dùng cho mục đích **học tập và demo**
- Không sử dụng để tấn công hệ thống thực tế
- Luôn có sự cho phép khi test penetration trên hệ thống

## 📚 Tài liệu tham khảo

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST RBAC Model](https://csrc.nist.gov/projects/role-based-access-control)
- [XACML ABAC Standard](http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html)

