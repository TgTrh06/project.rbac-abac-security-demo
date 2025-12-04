import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  department: { type: String, default: "general" },
  clearance: { type: String, enum: ["public", "confidential", "secret", "top_secret"], default: "public" },
});

export default mongoose.model("User", userSchema);