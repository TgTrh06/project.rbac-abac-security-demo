import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const execAsync = promisify(exec);

const dbUri = process.env.MONGO_URI;
const exportDir = path.resolve('./export');
const outputFile = path.join(exportDir, 'users.json');

async function exportUsersToJson() {
  try {
    // Tạo thư mục export nếu chưa có
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Lệnh mongoexport
    const exportCommand = `mongoexport --uri="${dbUri}" --collection=users --out="${outputFile}" --jsonArray --pretty`;

    console.log(`⏳ Đang thực hiện: ${exportCommand}`);
    const { stdout, stderr } = await execAsync(exportCommand);

    if (stdout) console.log(`✅ Kết quả:\n${stdout}`);
    if (stderr) console.warn(`⚠️ Cảnh báo:\n${stderr}`);

    console.log(`🎉 Xuất dữ liệu thành công vào: ${outputFile}`);
  } catch (error) {
    console.error(`❌ Lỗi khi export MongoDB:\n${error.message}`);
  }
}

exportUsersToJson();