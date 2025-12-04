import express from "express";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// VULNERABLE: No Role Check
router.get("/admin", authenticate, (req, res) => {
  res.json({ message: "Welcome, admin! (VULNERABLE: No Role Check)" });
});

// VULNERABLE: No Department Check
router.get("/department", authenticate, (req, res) => {
  res.json({ message: `Welcome to IT department, ${req.user.username} (VULNERABLE: No Dept Check)` });
});

// VULNERABLE: No Clearance Check
router.get("/top-secret", authenticate, (req, res) => {
  res.json({ message: "TOP SECRET DATA: Alien existence confirmed. (VULNERABLE: Leaked!)" });
});

router.get("/secret", authenticate, (req, res) => {
  res.json({ message: "SECRET DATA: The cake is a lie. (VULNERABLE: Leaked!)" });
});

// VULNERABLE: No Time Check
router.get("/work-hours", authenticate, (req, res) => {
  res.json({ message: "You are accessing this resource during working hours. (VULNERABLE: Always Open)" });
});

// VULNERABLE: No IP Check
router.get("/office-ip", authenticate, (req, res) => {
  res.json({ message: "You are accessing this from a trusted Office IP. (VULNERABLE: Any IP Allowed)" });
});

export default router;