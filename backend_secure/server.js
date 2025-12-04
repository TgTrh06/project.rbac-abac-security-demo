import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import { getLogs } from "./middlewares/logger.js";
import { getPolicyConfig, updatePolicyConfig } from "./middlewares/abac.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
      department: user.department,
      clearance: user.clearance
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// Audit Logs
app.get("/api/logs", (req, res) => {
  res.json(getLogs());
});

// Policy Management
app.get("/api/policy", (req, res) => {
  res.json(getPolicyConfig());
});

app.put("/api/policy", (req, res) => {
  const { workHours, allowedIPs } = req.body;
  updatePolicyConfig({ workHours, allowedIPs });
  res.json({ message: "Policy updated successfully", policy: getPolicyConfig() });
});

// User Management
app.get("/api/users", async (req, res) => {
  const users = await User.find({}, { password: 0 });
  res.json(users);
});

app.put("/api/users/:id/clearance", async (req, res) => {
  const { clearance } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { clearance },
    { new: true, select: '-password' }
  );
  res.json({ message: "User clearance updated", user });
});

app.use("/api/resource", resourceRoutes);

app.listen(process.env.PORT, () => console.log(`✅ Secure server running on port ${process.env.PORT}`));