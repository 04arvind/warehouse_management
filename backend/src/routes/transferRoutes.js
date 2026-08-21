const express = require("express");

const {
    getTransfers,
    getTransfer,
    createTransfer,
    approveTransfer,
    rejectTransfer,
    shipTransfer,
    completeTransfer,
    cancelTransfer,
    getTransferStats,
} = require("../controllers/transferController");

const {
    requireClerkAuth,
} = require("../middleware/auth");

const requireRole =
    require("../middleware/role");

const router = express.Router();


// GET transfer statistics
router.get(
    "/stats",
    requireClerkAuth,
    getTransferStats
);


// GET all transfers
router.get(
    "/",
    requireClerkAuth,
    getTransfers
);


// GET single transfer
router.get(
    "/:id",
    requireClerkAuth,
    getTransfer
);


// CREATE transfer request
// All authenticated users
router.post(
    "/",
    requireClerkAuth,
    createTransfer
);


// APPROVE transfer
// Manager and Admin
router.patch(
    "/:id/approve",
    requireClerkAuth,
    requireRole("ADMIN", "MANAGER"),
    approveTransfer
);


// REJECT transfer
// Manager and Admin
router.patch(
    "/:id/reject",
    requireClerkAuth,
    requireRole("ADMIN", "MANAGER"),
    rejectTransfer
);


// MARK as in-transit
// Manager and Admin
router.patch(
    "/:id/ship",
    requireClerkAuth,
    requireRole("ADMIN", "MANAGER"),
    shipTransfer
);


// COMPLETE transfer
// Manager and Admin
router.patch(
    "/:id/complete",
    requireClerkAuth,
    requireRole("ADMIN", "MANAGER"),
    completeTransfer
);


// CANCEL transfer
// Manager and Admin
router.patch(
    "/:id/cancel",
    requireClerkAuth,
    requireRole("ADMIN", "MANAGER"),
    cancelTransfer
);


module.exports = router;