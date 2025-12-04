const logs = [];

export const logAccess = (user, resource, action, outcome, reason = null, policy = null) => {
    const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        user: user ? `${user.username} (${user.role})` : "Anonymous",
        resource,
        action,
        outcome, // "ALLOWED" or "DENIED"
        reason,
        policy
    };

    logs.unshift(logEntry);
    if (logs.length > 50) logs.pop(); // Keep last 50 logs
};

export const getLogs = () => logs;
