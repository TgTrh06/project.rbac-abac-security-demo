import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedUsers = async () => {
  await User.deleteMany({});
  const hashed = await bcrypt.hash("123456", 10);
  await User.insertMany([
    { username: "admin", password: hashed, role: "admin", department: "IT" },
    { username: "user1", password: hashed, role: "user", department: "HR" },
    { username: "user2", password: hashed, role: "user", department: "IT" },
  ]);
  console.log("✅ Seed complete!");
  process.exit();
};

seedUsers();
