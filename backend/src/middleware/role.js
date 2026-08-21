const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.auth || !req.auth.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const userRole =
                req.auth.sessionClaims?.metadata?.role ||
                req.auth.sessionClaims?.publicMetadata?.role ||
                req.auth.sessionClaims?.public_metadata?.role;

            if (!userRole) {
                return res.status(403).json({
                    success: false,
                    message: "User role not found",
                });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            req.userRole = userRole;

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = requireRole;