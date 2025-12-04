import { logAccess } from "./logger.js";

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logAccess(req.user, `Admin Resource`, "ACCESS", "DENIED", "Insufficient Role", "RBAC-Role");
      return res.status(403).json({
        message: "Access denied: insufficient role",
        policy: "RoleCheck",
        required: roles,
        current: req.user.role
      });
    }
    logAccess(req.user, `Admin Resource`, "ACCESS", "ALLOWED", null, "RBAC-Role");
    next();
  };
};