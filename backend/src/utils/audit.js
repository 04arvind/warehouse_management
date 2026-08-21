const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
    userId,
    action,
    resource,
    resourceId = null,
    details = "",
}) => {
    try {
        const log = await AuditLog.create({
            userId,
            action,
            resource,
            resourceId,
            details,
        });

        return log;
    } catch (error) {
        /*
         * Audit logging should not break the
         * main business operation.
         */
        console.error(
            "Audit log error:",
            error.message
        );

        return null;
    }
};

module.exports = {
    createAuditLog,
};