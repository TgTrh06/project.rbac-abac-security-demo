export default function VulnerableDemo() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-red-600">❌ Vulnerable Demo</h2>
      <p>Đây là phiên bản <b>có lỗ hổng</b> – người dùng có thể truy cập tài nguyên dù không có quyền.</p>
    </div>
  );
}