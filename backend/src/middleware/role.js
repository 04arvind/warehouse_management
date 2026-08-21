const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.auth || !req.auth.userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const rawRole =
                req.auth.sessionClaims?.metadata?.role ||
                req.auth.sessionClaims?.publicMetadata?.role ||
                req.auth.sessionClaims?.public_metadata?.role ||
                req.auth.sessionClaims?.role ||
                req.auth.claims?.metadata?.role ||
                req.auth.claims?.publicMetadata?.role;

            // Default role is USER/STAFF if not explicitly set in metadata
            const userRole = (rawRole || "USER").toString().toUpperCase();

            // Normalize allowed roles to uppercase
            const normalizedAllowedRoles = allowedRoles.map((r) =>
                r.toUpperCase()
            );

            // ADMIN always has full access
            if (
                userRole === "ADMIN" ||
                normalizedAllowedRoles.includes(userRole) ||
                (userRole === "USER" && normalizedAllowedRoles.includes("STAFF")) ||
                (userRole === "STAFF" && normalizedAllowedRoles.includes("USER"))
            ) {
                req.userRole = userRole;
                return next();
            }

            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions.",
            });
        } catch (error) {
            next(error);
        }
    };
};

module.exports = requireRole;