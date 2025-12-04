# 📚 Attack Simulation - Documentation Index

Chào mừng đến với Attack Simulation Tool! Đây là danh mục tất cả tài liệu và hướng dẫn.

---

## 🚀 Quick Start

**Mới bắt đầu? Đọc [SETUP_GUIDE.md](./SETUP_GUIDE.md) 🏠**

**Bắt đầu nhanh nhất:**
```bash
.\quick-test.ps1
```

**Hoặc xem:** [DEMO_GUIDE.md](./DEMO_GUIDE.md)

---

## 📖 Tài liệu chính

### 0. [SETUP_GUIDE.md](./SETUP_GUIDE.md) 🏠 **START HERE**
**Tài liệu chính của project - Tổng quan Attack Simulation**
- Setup hoàn chỉnh trong 3 bước
- Kết quả mong đợi
- Kịch bản tấn công
- Attack targets
- Commands cheat sheet
- Demo flow (12 phút)

**Dành cho:** Mọi người - Điểm khởi đầu tốt nhất!

---

### 1. [DEMO_GUIDE.md](./DEMO_GUIDE.md) ⭐ **RECOMMENDED**
**Hướng dẫn demo chi tiết từng bước**
- Cách chạy demo (3 options)
- Kết quả mong đợi
- Phân tích chi tiết
- Điểm nhấn khi present
- **Thời lượng:** ~12 phút

**Dành cho:** Người muốn demo hoặc present

---

### 2. [ATTACK_SUMMARY.md](./ATTACK_SUMMARY.md)
**Tổng quan toàn diện về attack simulation**
- Mục đích và kịch bản
- Kết quả tổng hợp
- Bài học rút ra
- Best practices
- Attack vectors demonstrated
- Metrics và đánh giá

**Dành cho:** Người muốn hiểu tổng quan

---

### 3. [COMPARISON.md](./COMPARISON.md)
**So sánh chi tiết Vulnerable vs Secure**
- Bảng so sánh từng resource
- Protection mechanisms
- Code comparison
- Audit log comparison
- Security metrics
- Real-world impact

**Dành cho:** Người muốn phân tích kỹ thuật

---

### 4. [attack-simulation/SETUP_GUIDE.md](./attack-simulation/SETUP_GUIDE.md)
**Tài liệu kỹ thuật của Attack Simulation Tool**
- Attacker profile
- Cách cài đặt và sử dụng
- Attack targets
- Chi tiết kỹ thuật
- Mở rộng

**Dành cho:** Developer

---

### 5. [ATTACK_SIMULATION.md](./ATTACK_SIMULATION.md)
**Quick reference cho attack simulation**
- Giới thiệu ngắn gọn
- Quick start
- Kết quả mong đợi
- Link đến tài liệu chi tiết

**Dành cho:** Quick reference

---

## 🛠️ Scripts

### PowerShell Scripts

#### 1. `run-attack-demo.ps1` ⭐ **FULL DEMO**
**Chạy toàn bộ demo tự động**
```bash
.\run-attack-demo.ps1
```
- Mở 2 terminal cho backends
- Chạy attack simulation
- Hiển thị kết quả

**Dành cho:** Demo presentation

---

#### 2. `quick-test.ps1` ⭐ **QUICK TEST**
**Test nhanh với kiểm tra prerequisites**
```bash
.\quick-test.ps1
```
- Kiểm tra MongoDB
- Kiểm tra backends
- Chạy attack simulation

**Dành cho:** Testing và development

---

### Node.js Scripts

#### 1. `attack-simulation/attacker.js`
**Main attack script với colorful output**
```bash
cd attack-simulation
npm run attack
```

#### 2. `attack-simulation/generate-report.js`
**Tạo JSON report**
```bash
cd attack-simulation
npm run report
```

#### 3. `attack-simulation/seed-attacker.js`
**Seed attacker user vào database**
```bash
cd attack-simulation
npm run seed
```

---

## 📁 Cấu trúc Files

```
project.rbac-abac-security-demo/
│
├── 📄 SETUP_GUIDE.md                  🏠 MAIN ENTRY POINT - Start here!
├── 📄 INDEX.md                   📚 Documentation index
├── 📄 DEMO_GUIDE.md              ⭐ Hướng dẫn demo chi tiết
├── 📄 ATTACK_SUMMARY.md          📊 Tổng quan toàn diện
├── 📄 COMPARISON.md              🔍 So sánh chi tiết
├── 📄 ATTACK_SIMULATION.md       📝 Quick reference
│
├── 🔧 run-attack-demo.ps1        🎬 Full demo script
├── 🔧 quick-test.ps1             ⚡ Quick test script
│
├── attack-simulation/
│   ├── 📄 SETUP_GUIDE.md              📖 Technical docs
│   ├── 🔧 attacker.js            🎭 Main attack script
│   ├── 🔧 generate-report.js     📊 Report generator
│   ├── 🔧 seed-attacker.js       🌱 Seed script
│   ├── 📦 package.json           📦 Dependencies
│   ├── 📝 .env.example           ⚙️ Config example
│   └── 🚫 .gitignore             🚫 Git ignore
│
├── backend_vulnerable/           🔓 Vulnerable backend
├── backend_secure/               🔒 Secure backend
└── frontend/                     🎨 React frontend
```

---

## 🎯 Use Cases

### Case 0: Tôi mới bắt đầu - Chưa biết gì
1. Đọc [SETUP_GUIDE.md](./SETUP_GUIDE.md) 🏠
2. Chạy `.\quick-test.ps1`
3. Xem kết quả và hiểu cơ bản

### Case 1: Tôi muốn demo cho presentation
1. Đọc [SETUP_GUIDE.md](./SETUP_GUIDE.md) hoặc [DEMO_GUIDE.md](./DEMO_GUIDE.md)
2. Chạy `.\run-attack-demo.ps1`
3. Follow the demo flow (12 phút)

### Case 2: Tôi muốn hiểu attack simulation
1. Đọc [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Đọc [ATTACK_SUMMARY.md](./ATTACK_SUMMARY.md)
3. Đọc [COMPARISON.md](./COMPARISON.md)
4. Chạy `.\quick-test.ps1` để test

### Case 3: Tôi muốn phát triển/mở rộng
1. Đọc [attack-simulation/SETUP_GUIDE.md](./attack-simulation/SETUP_GUIDE.md)
2. Xem code trong `attack-simulation/`
3. Modify và test

### Case 4: Tôi cần quick reference
1. Đọc [ATTACK_SIMULATION.md](./ATTACK_SIMULATION.md)
2. Chạy `.\quick-test.ps1`

---

## 🎓 Learning Path

### Beginner
1. ✅ Đọc [SETUP_GUIDE.md](./SETUP_GUIDE.md) 🏠
2. ✅ Đọc [ATTACK_SIMULATION.md](./ATTACK_SIMULATION.md)
3. ✅ Chạy `.\quick-test.ps1`
4. ✅ Xem kết quả

### Intermediate
1. ✅ Đọc [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. ✅ Đọc [DEMO_GUIDE.md](./DEMO_GUIDE.md)
3. ✅ Đọc [COMPARISON.md](./COMPARISON.md)
4. ✅ Chạy `.\run-attack-demo.ps1`
5. ✅ Phân tích audit logs

### Advanced
1. ✅ Đọc [ATTACK_SUMMARY.md](./ATTACK_SUMMARY.md)
2. ✅ Đọc [attack-simulation/SETUP_GUIDE.md](./attack-simulation/SETUP_GUIDE.md)
3. ✅ Xem source code
4. ✅ Mở rộng attack vectors
5. ✅ Implement thêm defenses

---

## 🔗 Quick Links

| Tôi muốn... | Đọc file... | Chạy script... |
|------------|------------|---------------|
| Bắt đầu | [SETUP_GUIDE.md](./SETUP_GUIDE.md) 🏠 | `.\quick-test.ps1` |
| Demo nhanh | [DEMO_GUIDE.md](./DEMO_GUIDE.md) | `.\run-attack-demo.ps1` |
| Test nhanh | [ATTACK_SIMULATION.md](./ATTACK_SIMULATION.md) | `.\quick-test.ps1` |
| Hiểu tổng quan | [ATTACK_SUMMARY.md](./ATTACK_SUMMARY.md) | - |
| So sánh chi tiết | [COMPARISON.md](./COMPARISON.md) | - |
| Phát triển | [attack-simulation/SETUP_GUIDE.md](./attack-simulation/SETUP_GUIDE.md) | `npm run attack` |

---

## 📊 Cheat Sheet

### Setup (One-time)
```bash
cd attack-simulation
npm install
npm run seed
```

### Run Demo
```bash
# Option 1: Automated
.\run-attack-demo.ps1

# Option 2: Quick test
.\quick-test.ps1

# Option 3: Manual
cd attack-simulation
npm run attack
```

### Generate Report
```bash
cd attack-simulation
npm run report
```

### Check Audit Logs
```bash
curl http://localhost:5002/api/logs
```

### Check Policy Config
```bash
curl http://localhost:5002/api/policy
```

---

## 🆘 Troubleshooting

### MongoDB not running
```bash
# Check MongoDB status
mongosh --eval "db.version()"

# Start MongoDB (if local)
net start MongoDB
```

### Backends not running
```bash
# Terminal 1
cd backend_vulnerable
npm start

# Terminal 2
cd backend_secure
npm start
```

### Attacker user not found
```bash
cd attack-simulation
npm run seed
```

### Port conflicts
- Vulnerable: Port 5001
- Secure: Port 5002
- Check if ports are free: `netstat -ano | findstr :5001`

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra [Troubleshooting](#-troubleshooting)
2. Đọc lại [DEMO_GUIDE.md](./DEMO_GUIDE.md)
3. Xem logs trong terminal
4. Check MongoDB connection

---

## 🎉 Credits

**Created by:** RBAC/ABAC Security Demo Team  
**Purpose:** Educational demonstration of security concepts  
**License:** MIT  
**Version:** 1.0.0

---

**Happy Hacking! 🎭🔒**

