const Warehouse = require("../models/Warehouse");
const Inventory = require("../models/Inventory");


// GET /api/warehouses
const getWarehouses = async (req, res, next) => {
    try {
        const warehouses = await Warehouse.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            warehouses,
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

        res.status(200).json({
            success: true,
            warehouse,
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

        const existingWarehouse =
            await Warehouse.findOne({
                code: code.toUpperCase(),
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
                name,
                code,
                location,
                capacity,
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