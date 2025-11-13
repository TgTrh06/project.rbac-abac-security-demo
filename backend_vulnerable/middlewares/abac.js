export const authorizeDepartment = (department) => {
  return (req, res, next) => {
    if (req.user.department !== department) {
      return res.status(403).json({ message: "Access denied: department mismatch" });
    }
    next();
  };
};