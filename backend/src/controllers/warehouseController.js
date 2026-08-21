const Warehouse = require("../models/Warehouse");
const Inventory = require("../models/Inventory");
const { createAuditLog } = require("../utils/audit");


// GET /api/warehouses
const getWarehouses = async (req, res, next) => {
    try {
        const warehouses = await Warehouse.find()
            .sort({ createdAt: -1 });

        // Calculate actual utilization per warehouse
        const enhancedWarehouses = await Promise.all(
            warehouses.map(async (wh) => {
                const inventory = await Inventory.find({ warehouse: wh._id });
                const usedCapacity = inventory.reduce(
                    (sum, item) => sum + (Number(item.quantity) || 0),
                    0
                );
                const capacity = Number(wh.capacity) || 1;
                const utilization = Math.min(
                    100,
                    Math.round((usedCapacity / capacity) * 100)
                );
                const whObj = wh.toObject();
                return {
                    ...whObj,
                    usedCapacity,
                    utilization,
                };
            })
        );

        res.status(200).json({
            success: true,
            warehouses: enhancedWarehouses,
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/warehouses/:id
const getWarehouse = async (req, res, next) => {
    try {
        const warehouse = await Warehouse.findById(
            req.params.id
        );

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found",
            });
        }

        const inventory = await Inventory.find({ warehouse: warehouse._id });
        const usedCapacity = inventory.reduce(
            (sum, item) => sum + (Number(item.quantity) || 0),
            0
        );
        const capacity = Number(warehouse.capacity) || 1;
        const utilization = Math.min(
            100,
            Math.round((usedCapacity / capacity) * 100)
        );

        const whObj = warehouse.toObject();

        res.status(200).json({
            success: true,
            warehouse: {
                ...whObj,
                usedCapacity,
                utilization,
            },
        });
    } catch (error) {
        next(error);
    }
};


// POST /api/warehouses
const createWarehouse = async (req, res, next) => {
    try {
        const {
            name,
            code,
            location,
            address,
            capacity,
        } = req.body;

        if (
            !name ||
            !code ||
            !location ||
            capacity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, code, location and capacity are required",
            });
        }

        const parsedCapacity = Number(capacity);
        if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be a positive number",
            });
        }

        const existingWarehouse =
            await Warehouse.findOne({
                code: code.toUpperCase().trim(),
            });

        if (existingWarehouse) {
            return res.status(409).json({
                success: false,
                message:
                    "Warehouse code already exists",
            });
        }

        const warehouse =
            await Warehouse.create({
                name: name.trim(),
                code: code.toUpperCase().trim(),
                location: location.trim(),
                address: address ? address.trim() : "",
                capacity: parsedCapacity,
            });

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "WAREHOUSE_CREATED",
            resource: "Warehouse",
            resourceId: warehouse._id.toString(),
            details: `Created warehouse ${warehouse.name} (${warehouse.code}) in ${warehouse.location}`,
        });

        res.status(201).json({
            success: true,
            message:
                "Warehouse created successfully",
            warehouse,
        });
    } catch (error) {
        next(error);
    }
};


// PUT /api/warehouses/:id
const updateWarehouse = async (
    req,
    res,
    next
) => {
    try {
        const warehouse =
            await Warehouse.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found",
            });
        }

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "WAREHOUSE_UPDATED",
            resource: "Warehouse",
            resourceId: warehouse._id.toString(),
            details: `Updated warehouse ${warehouse.name} (${warehouse.code})`,
        });

        res.status(200).json({
            success: true,
            message:
                "Warehouse updated successfully",
            warehouse,
        });
    } catch (error) {
        next(error);
    }
};


// DELETE /api/warehouses/:id
const deleteWarehouse = async (
    req,
    res,
    next
) => {
    try {
        const warehouse =
            await Warehouse.findById(
                req.params.id
            );

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found",
            });
        }

        const inventoryCount =
            await Inventory.countDocuments({
                warehouse: warehouse._id,
            });

        if (inventoryCount > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete warehouse with inventory",
            });
        }

        await warehouse.deleteOne();

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "WAREHOUSE_DELETED",
            resource: "Warehouse",
            resourceId: warehouse._id.toString(),
            details: `Deleted warehouse ${warehouse.name} (${warehouse.code})`,
        });

        res.status(200).json({
            success: true,
            message:
                "Warehouse deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/warehouses/:id/stats
const getWarehouseStats = async (
    req,
    res,
    next
) => {
    try {
        const warehouse =
            await Warehouse.findById(
                req.params.id
            );

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found",
            });
        }

        const inventory =
            await Inventory.find({
                warehouse: warehouse._id,
            });

        const totalProducts =
            inventory.length;

        const totalQuantity =
            inventory.reduce(
                (sum, item) =>
                    sum + item.quantity,
                0
            );

        const lowStockItems =
            inventory.filter(
                (item) =>
                    item.quantity <=
                    item.minimumStock
            ).length;

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalQuantity,
                lowStockItems,
            },
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getWarehouses,
    getWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehouseStats,
};