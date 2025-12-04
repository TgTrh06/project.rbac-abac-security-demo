# 🎭 Attack Simulation - Tổng quan

## 📌 Mục đích

Mô phỏng kịch bản tấn công thực tế để chứng minh:
- Sự khác biệt giữa hệ thống **có** và **không có** RBAC/ABAC
- Tầm quan trọng của việc kiểm tra Authorization (không chỉ Authentication)
- Hiệu quả của Defense in Depth strategy

---

## 🎯 Kịch bản

### Attacker Profile
```
Username: attacker
Password: attacker123
Role: user (không phải admin)
Department: null (không thuộc phòng ban nào)
Clearance: public (mức bảo mật thấp nhất)
```

### Mục tiêu tấn công
Truy cập trái phép vào 6 resources nhạy cảm:
1. **Admin Resource** - Yêu cầu role admin
2. **Department Resource** - Yêu cầu thuộc IT department
3. **Top Secret Data** - Yêu cầu top_secret clearance
4. **Secret Data** - Yêu cầu secret clearance
5. **Work Hours Resource** - Yêu cầu truy cập trong giờ làm việc
6. **Office IP Resource** - Yêu cầu IP được phép

---

## 📊 Kết quả

### 🔓 Vulnerable System (Port 5001)
- **Không có** RBAC middleware
- **Không có** ABAC policies
- **Chỉ kiểm tra** authentication (có token hợp lệ)

**Kết quả:**
```
🚨 6/6 resources compromised!
Success Rate: 100%
```

### 🔒 Secure System (Port 5002)
- **Có** RBAC middleware (kiểm tra role)
- **Có** ABAC policies (department, clearance, time, IP)
- **Có** Audit logging

**Kết quả:**
```
✅ 6/6 resources protected!
Defense Rate: 100%
```

---

## 🚀 Cách sử dụng

### Option 1: Quick Test (Recommended)
```bash
.\quick-test.ps1
```

### Option 2: Full Demo
```bash
.\run-attack-demo.ps1
```

### Option 3: Manual
```bash
# 1. Seed attacker
cd attack-simulation
npm run seed

# 2. Start backends (2 terminals)
cd backend_vulnerable && npm start  # Port 5001
cd backend_secure && npm start      # Port 5002

# 3. Run attack
cd attack-simulation
npm run attack
```

---

## 📁 Files Created

### Attack Simulation Tool
```
attack-simulation/
├── attacker.js              # Main attack script (colorful output)
├── generate-report.js       # JSON report generator
├── seed-attacker.js         # Seed attacker user to DB
├── package.json             # Dependencies
├── .env.example             # Configuration example
├── .gitignore              # Git ignore rules
└── README.md               # Detailed documentation
```

### Documentation
```
DEMO_GUIDE.md               # Comprehensive demo guide
ATTACK_SIMULATION.md        # Quick reference
run-attack-demo.ps1         # Automated demo script
quick-test.ps1              # Quick test script
```

---

## 🎓 Bài học

### 1. Authentication ≠ Authorization
- Có token hợp lệ **không có nghĩa** có quyền truy cập mọi thứ
- Cần kiểm tra **quyền hạn cụ thể** cho từng resource

### 2. RBAC (Role-Based Access Control)
- Phân quyền dựa trên **vai trò** (admin, user, manager...)
- Đơn giản, dễ quản lý cho các hệ thống nhỏ

### 3. ABAC (Attribute-Based Access Control)
- Phân quyền dựa trên **nhiều thuộc tính**:
  - User attributes: role, department, clearance
  - Resource attributes: classification, owner
  - Environment attributes: time, location, IP
- Linh hoạt hơn RBAC, phù hợp hệ thống phức tạp

### 4. Defense in Depth
- Kết hợp **nhiều lớp bảo mật**:
  - Authentication (JWT)
  - RBAC (Role check)
  - ABAC (Attribute checks)
  - Audit Logging
- Một lớp bị vượt qua, còn các lớp khác bảo vệ

### 5. Audit Logging
- Ghi lại **mọi lần truy cập** (thành công/thất bại)
- Phát hiện **hành vi bất thường**
- Điều tra **sau sự cố**

---

## 🔍 Attack Vectors Demonstrated

| Attack Type | Vulnerable | Secure | Protection |
|------------|-----------|---------|-----------|
| Privilege Escalation | ✗ Success | ✓ Blocked | RBAC Role Check |
| Department Bypass | ✗ Success | ✓ Blocked | ABAC Department Check |
| Data Classification Breach | ✗ Success | ✓ Blocked | ABAC Clearance Check |
| Time-based Attack | ✗ Success | ✓ Blocked | ABAC Time Policy |
| IP Spoofing | ✗ Success | ✓ Blocked | ABAC IP Policy |

---

## 📈 Metrics

### Vulnerable System
- **Authentication**: ✓ Implemented
- **Authorization**: ✗ Not Implemented
- **Audit Logging**: ✗ Not Implemented
- **Security Score**: 1/10

### Secure System
- **Authentication**: ✓ JWT with secret verification
- **Authorization**: ✓ RBAC + ABAC
- **Audit Logging**: ✓ Comprehensive logging
- **Security Score**: 9/10

---

## 🎬 Demo Flow

1. **Introduction** (2 min)
   - Giới thiệu attacker profile
   - Mục tiêu: Đánh cắp 6 loại dữ liệu nhạy cảm

2. **Attack Vulnerable System** (3 min)
   - Login thành công
   - Truy cập tất cả resources
   - 100% dữ liệu bị lộ

3. **Attack Secure System** (3 min)
   - Login thành công
   - Mọi truy cập bị chặn
   - Lý do rõ ràng cho mỗi lần chặn

4. **Analysis** (2 min)
   - So sánh kết quả
   - Giải thích các protection mechanisms
   - Xem audit logs

5. **Conclusion** (2 min)
   - Tầm quan trọng của RBAC/ABAC
   - Best practices
   - Q&A

**Total: ~12 minutes**

---

## 💡 Best Practices

1. **Never trust client input**
   - Luôn verify role/permissions từ database
   - Không tin role trong JWT payload

2. **Implement multiple layers**
   - Authentication + Authorization + Logging
   - Defense in Depth

3. **Use ABAC for complex scenarios**
   - Time-based access
   - Location-based access
   - Dynamic policies

4. **Log everything**
   - Successful access
   - Failed attempts
   - Policy violations

5. **Regular security audits**
   - Review logs
   - Test penetration
   - Update policies

---

## 🚨 Common Vulnerabilities

### ❌ Vulnerable Pattern
```javascript
// BAD: Trust role from JWT
app.get('/admin', authenticate, (req, res) => {
  // No role check!
  res.json({ secret: "admin data" });
});
```

### ✅ Secure Pattern
```javascript
// GOOD: Verify role from database
app.get('/admin', 
  authenticate,           // Check JWT
  authorizeRole('admin'), // Check role from DB
  (req, res) => {
    res.json({ secret: "admin data" });
  }
);
```

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control)
- [XACML ABAC](http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🎯 Next Steps

1. **Extend the demo:**
   - Add more attack vectors
   - Implement rate limiting
   - Add IP blacklisting

2. **Visualization:**
   - Real-time attack dashboard
   - Charts and graphs
   - Heatmaps

3. **Advanced features:**
   - Multi-factor authentication
   - Anomaly detection
   - Machine learning for threat detection

---

**Created by:** RBAC/ABAC Security Demo Team  
**Last Updated:** 2025-12-04  
**Version:** 1.0.0

