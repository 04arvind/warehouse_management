const express = require("express");

const {
    getInventory,
    getInventoryItem,
    getWarehouseInventory,
    createInventory,
    updateStock,
    getLowStock,
    searchInventory,
} = require("../controllers/inventoryController");

const {
    requireClerkAuth,
} = require("../middleware/auth");

const requireRole =
    require("../middleware/role");

const router = express.Router();


// GET all inventory
router.get(
    "/",
    requireClerkAuth,
    getInventory
);


// GET low-stock items
router.get(
    "/low-stock",
    requireClerkAuth,
    getLowStock
);


// SEARCH inventory
router.get(
    "/search",
    requireClerkAuth,
    searchInventory
);


// GET inventory for warehouse
router.get(
    "/warehouse/:warehouseId",
    requireClerkAuth,
    getWarehouseInventory
);


// GET single inventory item
router.get(
    "/:id",
    requireClerkAuth,
    getInventoryItem
);


// CREATE inventory item
router.post(
    "/",
    requireClerkAuth,
    createInventory
);


// UPDATE stock
router.patch(
    "/:id/stock",
    requireClerkAuth,
    updateStock
);


module.exports = router;