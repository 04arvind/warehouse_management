const express = require("express");

const {
    getWarehouses,
    getWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehouseStats,
} = require("../controllers/warehouseController");

const {
    requireClerkAuth,
} = require("../middleware/auth");

const requireRole =
    require("../middleware/role");

const router = express.Router();


// GET all warehouses
router.get(
    "/",
    requireClerkAuth,
    getWarehouses
);


// GET warehouse by ID
router.get(
    "/:id",
    requireClerkAuth,
    getWarehouse
);


// GET warehouse statistics
router.get(
    "/:id/stats",
    requireClerkAuth,
    getWarehouseStats
);


// CREATE warehouse
// Admin and Manager
router.post(
    "/",
    requireClerkAuth,
    requireRole("ADMIN", "MANAGER"),
    createWarehouse
);


// UPDATE warehouse
// Admin and Manager
router.put(
    "/:id",
    requireClerkAuth,
    requireRole("ADMIN", "MANAGER"),
    updateWarehouse
);


// DELETE warehouse
// Admin only
router.delete(
    "/:id",
    requireClerkAuth,
    requireRole("ADMIN"),
    deleteWarehouse
);


module.exports = router;