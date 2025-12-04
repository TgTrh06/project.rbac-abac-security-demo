
## 10. 🎭 Attack Simulation (Mô phỏng tấn công)

### 10.1. Giới thiệu
Công cụ mô phỏng kịch bản tấn công thực tế:
- **Attacker**: User có tài khoản hợp lệ nhưng **không có quyền** (no role, no department, no clearance)
- **Mục tiêu**: Đánh cắp dữ liệu nhạy cảm từ hệ thống
- **So sánh**: Vulnerable system vs Secure system

### 10.2. Quick Start

#### Cách 1: Chạy tự động (PowerShell)
```bash
# Từ thư mục gốc của project
.\run-attack-demo.ps1
```

#### Cách 2: Chạy thủ công
```bash
# Terminal 1: Vulnerable Backend
cd backend_vulnerable
npm install
npm start  # Port 5001

# Terminal 2: Secure Backend
cd backend_secure
npm install
npm start  # Port 5002

# Terminal 3: Attack Simulation
cd attack-simulation
npm install
npm run seed    # Tạo attacker user
npm run attack  # Chạy attack
```

### 10.3. Kết quả mong đợi

**🔓 Vulnerable System:**
```
🚨 6/6 resources compromised! (100% breach rate)
✓ Admin Resource: DATA STOLEN!
✓ Department Resource: DATA STOLEN!
✓ Top Secret Data: DATA STOLEN!
✓ Secret Data: DATA STOLEN!
✓ Work Hours Resource: DATA STOLEN!
✓ Office IP Resource: DATA STOLEN!
```

**🔒 Secure System:**
```
✅ 6/6 resources protected! (100% defense rate)
✓ Admin Resource: PROTECTED! (Role check failed)
✓ Department Resource: PROTECTED! (Department check failed)
✓ Top Secret Data: PROTECTED! (Clearance check failed)
✓ Secret Data: PROTECTED! (Clearance check failed)
✓ Work Hours Resource: PROTECTED! (Time policy failed)
✓ Office IP Resource: PROTECTED! (IP policy failed)
```

### 10.4. Chi tiết
Xem thêm tại: [attack-simulation/README.md](./attack-simulation/README.md)

---

## 11. Kết quả & ảnh minh họa (hướng dẫn)
Những ảnh bao gồm:

1. `login_admin_secure.png` — màn hình login (secure) và token nhận được.
2. `access_admin_secure_ok.png` — kết quả truy cập endpoint admin (200 OK).
3. `access_department_secure_forbidden.png` — user không có department bị trả 403.
4. `vulnerable_login_admin_fake.png` — dùng vulnerable login (chọn role=admin) nhận token admin.
5. `attack_simulation_results.png` — kết quả attack simulation so sánh 2 hệ thống.

---
