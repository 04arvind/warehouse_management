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
router.patch(
    "/:id/approve",
    requireClerkAuth,
    approveTransfer
);


// REJECT transfer
router.patch(
    "/:id/reject",
    requireClerkAuth,
    rejectTransfer
);


// MARK as in-transit
router.patch(
    "/:id/ship",
    requireClerkAuth,
    shipTransfer
);


// COMPLETE transfer
router.patch(
    "/:id/complete",
    requireClerkAuth,
    completeTransfer
);


// CANCEL transfer
router.patch(
    "/:id/cancel",
    requireClerkAuth,
    cancelTransfer
);


module.exports = router;