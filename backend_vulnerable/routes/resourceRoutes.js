import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/rbac.js";
import { authorizeDepartment } from "../middlewares/abac.js";

const router = express.Router();

router.get("/admin", authenticate, authorizeRole(["admin"]), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

router.get("/department", authenticate, authorizeDepartment("IT"), (req, res) => {
  res.json({ message: `Welcome to IT department, ${req.user.username}` });
});

export default router;