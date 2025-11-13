import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import User from "./models/User.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("⚠️ Vulnerable MongoDB connected"));

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

// ❌ Vulnerable endpoints — no RBAC / ABAC check
app.get("/api/resource/admin", (req, res) => {
  res.json({ message: "⚠️ Anyone can access this admin resource" });
});

app.get("/api/resource/department", (req, res) => {
  res.json({ message: "⚠️ No department check — open access" });
});

app.listen(process.env.PORT, () => console.log(`⚠️ Vulnerable server running on port ${process.env.PORT}`));