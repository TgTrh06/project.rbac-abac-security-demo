import { logAccess } from "./logger.js";

const CLEARANCE_LEVELS = {
    public: 0,
    confidential: 1,
    secret: 2,
    top_secret: 3
};

// Dynamic Policy Store (In-memory, có thể chuyển sang DB sau)
let policyConfig = {
    workHours: { start: 9, end: 18 },
    allowedIPs: ["127.0.0.1", "::1", "::ffff:127.0.0.1"],
};

// Export getter/setter cho policy
export const getPolicyConfig = () => policyConfig;
export const updatePolicyConfig = (newConfig) => {
    policyConfig = { ...policyConfig, ...newConfig };
};

export const authorizeDepartment = (department) => {
    return (req, res, next) => {
        if (req.user.department !== department) {
            logAccess(req.user, `Department Resource (${department})`, "ACCESS", "DENIED", "Department mismatch", "ABAC-Dept");
            return res.status(403).json({
                message: "Access denied: department mismatch",
                policy: "DepartmentCheck",
                required: department,
                current: req.user.department
            });
        }
        logAccess(req.user, `Department Resource (${department})`, "ACCESS", "ALLOWED", null, "ABAC-Dept");
        next();
    };
};

export const checkTimePolicy = () => {
    return (req, res, next) => {
        const currentHour = new Date().getHours();
        const { start, end } = policyConfig.workHours;

        if (currentHour < start || currentHour >= end) {
            logAccess(req.user, "Time Restricted Resource", "ACCESS", "DENIED", "Outside allowed hours", "ABAC-Time");
            return res.status(403).json({
                message: "Access denied: Outside allowed hours",
                policy: "TimeRestriction",
                required: `${start}:00 - ${end}:00`,
                current: `${currentHour}:00`
            });
        }
        logAccess(req.user, "Time Restricted Resource", "ACCESS", "ALLOWED", null, "ABAC-Time");
        next();
    };
};

export const checkIPPolicy = () => {
    return (req, res, next) => {
        const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "127.0.0.1";
        const allowedIPs = policyConfig.allowedIPs;

        const isAllowed = allowedIPs.some(ip => clientIP.includes(ip));

        if (!isAllowed) {
            logAccess(req.user, "IP Restricted Resource", "ACCESS", "DENIED", "Invalid IP Address", "ABAC-IP");
            return res.status(403).json({
                message: "Access denied: Invalid IP Address",
                policy: "IPRestriction",
                required: allowedIPs,
                current: clientIP
            });
        }
        logAccess(req.user, "IP Restricted Resource", "ACCESS", "ALLOWED", null, "ABAC-IP");
        next();
    };
};

export const checkClearance = (requiredLevel) => {
    return (req, res, next) => {
        const userLevel = CLEARANCE_LEVELS[req.user.clearance] || 0;
        const reqLevel = CLEARANCE_LEVELS[requiredLevel] || 0;

        if (userLevel < reqLevel) {
            logAccess(req.user, `Classified Resource (${requiredLevel})`, "ACCESS", "DENIED", "Insufficient Clearance", "ABAC-Clearance");
            return res.status(403).json({
                message: "Access denied: Insufficient Clearance",
                policy: "ClearanceCheck",
                required: requiredLevel,
                current: req.user.clearance
            });
        }
        logAccess(req.user, `Classified Resource (${requiredLevel})`, "ACCESS", "ALLOWED", null, "ABAC-Clearance");
        next();
    };
};
