const Inventory = require("../models/Inventory");
const Warehouse = require("../models/Warehouse");


// GET /api/inventory
const getInventory = async (
    req,
    res,
    next
) => {
    try {
        const {
            warehouse,
            search,
        } = req.query;

        const filter = {};

        if (warehouse) {
            filter.warehouse = warehouse;
        }

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    sku: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const inventory =
            await Inventory.find(filter)
                .populate(
                    "warehouse",
                    "name code location"
                )
                .sort({
                    updatedAt: -1,
                });

        res.status(200).json({
            success: true,
            inventory,
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/inventory/:id
const getInventoryItem = async (
    req,
    res,
    next
) => {
    try {
        const item =
            await Inventory.findById(
                req.params.id
            ).populate(
                "warehouse",
                "name code location"
            );

        if (!item) {
            return res.status(404).json({
                success: false,
                message:
                    "Inventory item not found",
            });
        }

        res.status(200).json({
            success: true,
            inventory: item,
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/warehouses/:warehouseId/inventory
const getWarehouseInventory =
    async (req, res, next) => {
        try {
            const warehouse =
                await Warehouse.findById(
                    req.params.warehouseId
                );

            if (!warehouse) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Warehouse not found",
                });
            }

            const inventory =
                await Inventory.find({
                    warehouse:
                        req.params.warehouseId,
                }).sort({
                    name: 1,
                });

            res.status(200).json({
                success: true,
                inventory,
            });
        } catch (error) {
            next(error);
        }
    };


// POST /api/inventory
const createInventory = async (
    req,
    res,
    next
) => {
    try {
        const {
            warehouse,
            sku,
            name,
            quantity,
            minimumStock,
        } = req.body;

        if (
            !warehouse ||
            !sku ||
            !name
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Warehouse, SKU and name are required",
            });
        }

        const warehouseExists =
            await Warehouse.findById(
                warehouse
            );

        if (!warehouseExists) {
            return res.status(404).json({
                success: false,
                message:
                    "Warehouse not found",
            });
        }

        const existing =
            await Inventory.findOne({
                warehouse,
                sku: sku.toUpperCase(),
            });

        if (existing) {
            return res.status(409).json({
                success: false,
                message:
                    "SKU already exists in this warehouse",
            });
        }

        const item =
            await Inventory.create({
                warehouse,
                sku,
                name,
                quantity:
                    quantity || 0,
                minimumStock:
                    minimumStock || 10,
            });

        res.status(201).json({
            success: true,
            message:
                "Inventory item created successfully",
            inventory: item,
        });
    } catch (error) {
        next(error);
    }
};


// PATCH /api/inventory/:id/stock
const updateStock = async (
    req,
    res,
    next
) => {
    try {
        const {
            quantity,
        } = req.body;

        if (
            quantity === undefined ||
            quantity < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid quantity is required",
            });
        }

        const item =
            await Inventory.findByIdAndUpdate(
                req.params.id,
                {
                    quantity,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!item) {
            return res.status(404).json({
                success: false,
                message:
                    "Inventory item not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Stock updated successfully",
            inventory: item,
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/inventory/low-stock
const getLowStock = async (
    req,
    res,
    next
) => {
    try {
        const inventory =
            await Inventory.find({
                $expr: {
                    $lte: [
                        "$quantity",
                        "$minimumStock",
                    ],
                },
            }).populate(
                "warehouse",
                "name code"
            );

        res.status(200).json({
            success: true,
            inventory,
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/inventory/search
const searchInventory = async (
    req,
    res,
    next
) => {
    try {
        const {
            q,
        } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message:
                    "Search query is required",
            });
        }

        const inventory =
            await Inventory.find({
                $or: [
                    {
                        name: {
                            $regex: q,
                            $options: "i",
                        },
                    },
                    {
                        sku: {
                            $regex: q,
                            $options: "i",
                        },
                    },
                ],
            }).populate(
                "warehouse",
                "name code"
            );

        res.status(200).json({
            success: true,
            inventory,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getInventory,
    getInventoryItem,
    getWarehouseInventory,
    createInventory,
    updateStock,
    getLowStock,
    searchInventory,
};