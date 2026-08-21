const AuditLog = require("../models/AuditLog");


// GET /api/audit-logs
const getAuditLogs = async (
    req,
    res,
    next
) => {
    try {
        const {
            action,
            userId,
            resource,
        } = req.query;

        const filter = {};

        if (action) {
            filter.action = action;
        }

        if (userId) {
            filter.userId = userId;
        }

        if (resource) {
            filter.resource = resource;
        }

        const logs =
            await AuditLog.find(filter)
                .sort({
                    createdAt: -1,
                })
                .limit(200);

        res.status(200).json({
            success: true,
            logs,
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/audit-logs/:id
const getAuditLog = async (
    req,
    res,
    next
) => {
    try {
        const log =
            await AuditLog.findById(
                req.params.id
            );

        if (!log) {
            return res.status(404).json({
                success: false,
                message:
                    "Audit log not found",
            });
        }

        res.status(200).json({
            success: true,
            log,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAuditLogs,
    getAuditLog,
};