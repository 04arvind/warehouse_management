const express = require("express");

const {
    getAuditLogs,
    getAuditLog,
} = require("../controllers/auditController");

const {
    requireClerkAuth,
} = require("../middleware/auth");

const requireRole =
    require("../middleware/role");

const router = express.Router();


// GET all audit logs
// Admin only
router.get(
    "/",
    requireClerkAuth,
    requireRole("ADMIN"),
    getAuditLogs
);


// GET single audit log
// Admin only
router.get(
    "/:id",
    requireClerkAuth,
    requireRole("ADMIN"),
    getAuditLog
);


module.exports = router;