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


const {
    getWarehouseInventory,
} = require("../controllers/inventoryController");

// GET warehouse inventory
router.get(
    "/:warehouseId/inventory",
    requireClerkAuth,
    getWarehouseInventory
);


// GET warehouse statistics
router.get(
    "/:id/stats",
    requireClerkAuth,
    getWarehouseStats
);


// CREATE warehouse
router.post(
    "/",
    requireClerkAuth,
    createWarehouse
);


// UPDATE warehouse
router.put(
    "/:id",
    requireClerkAuth,
    updateWarehouse
);


// DELETE warehouse
router.delete(
    "/:id",
    requireClerkAuth,
    deleteWarehouse
);


module.exports = router;