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
    { username: "admin_it", password: hashed, role: "admin", department: "IT", clearance: "top_secret" },
    { username: "user_hr", password: hashed, role: "user", department: "HR", clearance: "confidential" },
    { username: "user_it", password: hashed, role: "user", department: "IT", clearance: "secret" },
    { username: "intern", password: hashed, role: "user", department: "General", clearance: "public" },
  ]);
  console.log("✅ Seed complete!");
  process.exit();
};

seedUsers();
