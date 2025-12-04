import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorizeRole } from "../middlewares/rbac.js";
import { authorizeDepartment, checkClearance, checkTimePolicy, checkIPPolicy } from "../middlewares/abac.js";

const router = express.Router();

// RBAC
router.get("/admin", authenticate, authorizeRole(["admin"]), (req, res) => {
  res.json({ message: "Welcome, admin! You have access to this RBAC protected resource." });
});

// ABAC - Department
router.get("/department", authenticate, authorizeDepartment("IT"), (req, res) => {
  res.json({ message: `Welcome to IT department, ${req.user.username}. You matched the Department policy.` });
});

// ABAC - Clearance (Bell-LaPadula)
router.get("/top-secret", authenticate, checkClearance("top_secret"), (req, res) => {
  res.json({ message: "TOP SECRET DATA: Alien existence confirmed." });
});

router.get("/secret", authenticate, checkClearance("secret"), (req, res) => {
  res.json({ message: "SECRET DATA: The cake is a lie." });
});

// ABAC - Time Policy (Dynamic)
router.get("/work-hours", authenticate, checkTimePolicy(), (req, res) => {
  res.json({ message: "You are accessing this resource during working hours." });
});

// ABAC - IP Policy (Dynamic)
router.get("/office-ip", authenticate, checkIPPolicy(), (req, res) => {
  res.json({ message: "You are accessing this from a trusted Office IP." });
});

export default router;