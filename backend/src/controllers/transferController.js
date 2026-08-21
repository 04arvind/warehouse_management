const mongoose = require("mongoose");

const Transfer = require("../models/Transfer");
const Inventory = require("../models/Inventory");
const Warehouse = require("../models/Warehouse");
const { createAuditLog } = require("../utils/audit");


// Generate transfer number
const generateTransferNumber =
    () => {
        const timestamp =
            Date.now();

        return `TR-${timestamp}`;
    };


// GET /api/transfers
const getTransfers = async (
    req,
    res,
    next
) => {
    try {
        const {
            status,
            warehouse,
        } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (warehouse) {
            filter.$or = [
                {
                    sourceWarehouse:
                        warehouse,
                },
                {
                    destinationWarehouse:
                        warehouse,
                },
            ];
        }

        const transfers =
            await Transfer.find(filter)
                .populate(
                    "sourceWarehouse",
                    "name code location"
                )
                .populate(
                    "destinationWarehouse",
                    "name code location"
                )
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            success: true,
            transfers,
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/transfers/:id
const getTransfer = async (
    req,
    res,
    next
) => {
    try {
        const transfer =
            await Transfer.findById(
                req.params.id
            )
                .populate(
                    "sourceWarehouse",
                    "name code location"
                )
                .populate(
                    "destinationWarehouse",
                    "name code location"
                )
                .populate(
                    "items.inventory"
                );

        if (!transfer) {
            return res.status(404).json({
                success: false,
                message:
                    "Transfer not found",
            });
        }

        res.status(200).json({
            success: true,
            transfer,
        });
    } catch (error) {
        next(error);
    }
};


// POST /api/transfers
const createTransfer = async (
    req,
    res,
    next
) => {
    try {
        const {
            sourceWarehouse,
            destinationWarehouse,
            items,
            notes,
        } = req.body;

        if (
            !sourceWarehouse ||
            !destinationWarehouse
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Source and destination warehouses are required",
            });
        }

        if (
            sourceWarehouse ===
            destinationWarehouse
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Source and destination cannot be the same",
            });
        }

        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one item is required",
            });
        }

        const source =
            await Warehouse.findById(
                sourceWarehouse
            );

        const destination =
            await Warehouse.findById(
                destinationWarehouse
            );

        if (!source || !destination) {
            return res.status(404).json({
                success: false,
                message:
                    "Warehouse not found",
            });
        }

        const transferItems = [];

        for (const item of items) {
            const inventoryId =
                item.inventory ||
                item.productId ||
                item._id ||
                item.id;

            if (!inventoryId) {
                return res.status(400).json({
                    success: false,
                    message: "Valid inventory item ID is required",
                });
            }

            const inventory =
                await Inventory.findOne({
                    _id: inventoryId,
                    warehouse:
                        sourceWarehouse,
                });

            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message:
                        `Inventory item not found in source warehouse`,
                });
            }

            const quantity = Number(item.quantity);

            if (
                !quantity ||
                quantity <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Quantity must be greater than 0",
                });
            }

            if (
                quantity >
                inventory.quantity
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Insufficient stock for ${inventory.name}. Available: ${inventory.quantity}`,
                });
            }

            transferItems.push({
                inventory:
                    inventory._id,
                sku: inventory.sku,
                name: inventory.name,
                quantity,
            });
        }

        const transfer =
            await Transfer.create({
                transferNumber:
                    generateTransferNumber(),

                sourceWarehouse,

                destinationWarehouse,

                items: transferItems,

                status: "PENDING",

                requestedBy:
                    req.auth?.userId || "anonymous",

                notes: notes || "",
            });

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "TRANSFER_CREATED",
            resource: "Transfer",
            resourceId: transfer._id.toString(),
            details: `Created transfer ${transfer.transferNumber} from ${source.name} to ${destination.name}`,
        });

        res.status(201).json({
            success: true,
            message:
                "Transfer request created successfully",
            transfer,
        });
    } catch (error) {
        next(error);
    }
};


// PATCH /api/transfers/:id/approve
const approveTransfer = async (
    req,
    res,
    next
) => {
    try {
        const transfer =
            await Transfer.findById(
                req.params.id
            );

        if (!transfer) {
            return res.status(404).json({
                success: false,
                message:
                    "Transfer not found",
            });
        }

        if (
            transfer.status !==
            "PENDING"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending transfers can be approved",
            });
        }

        transfer.status =
            "APPROVED";

        transfer.approvedBy =
            req.auth?.userId || "anonymous";

        await transfer.save();

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "TRANSFER_APPROVED",
            resource: "Transfer",
            resourceId: transfer._id.toString(),
            details: `Approved transfer ${transfer.transferNumber}`,
        });

        res.status(200).json({
            success: true,
            message:
                "Transfer approved",
            transfer,
        });
    } catch (error) {
        next(error);
    }
};


// PATCH /api/transfers/:id/reject
const rejectTransfer = async (
    req,
    res,
    next
) => {
    try {
        const {
            reason,
        } = req.body;

        const transfer =
            await Transfer.findById(
                req.params.id
            );

        if (!transfer) {
            return res.status(404).json({
                success: false,
                message:
                    "Transfer not found",
            });
        }

        if (
            transfer.status !==
            "PENDING"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending transfers can be rejected",
            });
        }

        transfer.status =
            "REJECTED";

        transfer.rejectionReason =
            reason || "No reason provided";

        await transfer.save();

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "TRANSFER_REJECTED",
            resource: "Transfer",
            resourceId: transfer._id.toString(),
            details: `Rejected transfer ${transfer.transferNumber}. Reason: ${transfer.rejectionReason}`,
        });

        res.status(200).json({
            success: true,
            message:
                "Transfer rejected",
            transfer,
        });
    } catch (error) {
        next(error);
    }
};


// PATCH /api/transfers/:id/ship
const shipTransfer = async (
    req,
    res,
    next
) => {
    try {
        const transfer =
            await Transfer.findById(
                req.params.id
            );

        if (!transfer) {
            return res.status(404).json({
                success: false,
                message:
                    "Transfer not found",
            });
        }

        if (
            transfer.status !==
            "APPROVED"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Only approved transfers can be shipped",
            });
        }

        transfer.status =
            "IN_TRANSIT";

        await transfer.save();

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "TRANSFER_SHIPPED",
            resource: "Transfer",
            resourceId: transfer._id.toString(),
            details: `Marked transfer ${transfer.transferNumber} as in transit`,
        });

        res.status(200).json({
            success: true,
            message:
                "Transfer marked as in transit",
            transfer,
        });
    } catch (error) {
        next(error);
    }
};


// PATCH /api/transfers/:id/complete
const completeTransfer = async (
    req,
    res,
    next
) => {
    let session = null;
    let useTransaction = true;

    try {
        session = await mongoose.startSession();
        session.startTransaction();
    } catch (sessionErr) {
        // Standalone MongoDB without replica set doesn't support transactions
        useTransaction = false;
        if (session) {
            try {
                session.endSession();
            } catch (e) {}
            session = null;
        }
    }

    try {
        const transferQuery = Transfer.findById(req.params.id);
        if (useTransaction && session) {
            transferQuery.session(session);
        }

        const transfer = await transferQuery;

        if (!transfer) {
            if (useTransaction && session) await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Transfer not found",
            });
        }

        if (transfer.status !== "IN_TRANSIT") {
            if (useTransaction && session) await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Only in-transit transfers can be completed",
            });
        }

        // Update source and destination inventory
        for (const item of transfer.items) {
            const srcQuery = Inventory.findOne({
                _id: item.inventory,
                warehouse: transfer.sourceWarehouse,
            });
            if (useTransaction && session) srcQuery.session(session);
            const sourceInventory = await srcQuery;

            if (!sourceInventory) {
                throw new Error(
                    `Source inventory not found for SKU ${item.sku}`
                );
            }

            if (sourceInventory.quantity < item.quantity) {
                throw new Error(
                    `Insufficient stock for SKU ${item.sku}. Available: ${sourceInventory.quantity}`
                );
            }

            sourceInventory.quantity -= item.quantity;
            if (useTransaction && session) {
                await sourceInventory.save({ session });
            } else {
                await sourceInventory.save();
            }

            // Find destination inventory
            const destQuery = Inventory.findOne({
                warehouse: transfer.destinationWarehouse,
                sku: item.sku,
            });
            if (useTransaction && session) destQuery.session(session);
            let destinationInventory = await destQuery;

            // Create destination item if it doesn't exist
            if (!destinationInventory) {
                destinationInventory = new Inventory({
                    warehouse: transfer.destinationWarehouse,
                    sku: item.sku,
                    name: item.name,
                    quantity: 0,
                    minimumStock: 10,
                });
            }

            destinationInventory.quantity += item.quantity;
            if (useTransaction && session) {
                await destinationInventory.save({ session });
            } else {
                await destinationInventory.save();
            }
        }

        transfer.status = "COMPLETED";
        transfer.completedBy = req.auth?.userId || "anonymous";
        transfer.completedAt = new Date();

        if (useTransaction && session) {
            await transfer.save({ session });
            await session.commitTransaction();
        } else {
            await transfer.save();
        }

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "TRANSFER_COMPLETED",
            resource: "Transfer",
            resourceId: transfer._id.toString(),
            details: `Completed transfer ${transfer.transferNumber} and updated stock`,
        });

        res.status(200).json({
            success: true,
            message: "Transfer completed and stock updated",
            transfer,
        });
    } catch (error) {
        if (useTransaction && session) {
            try {
                await session.abortTransaction();
            } catch (abortErr) {}
        }
        next(error);
    } finally {
        if (useTransaction && session) {
            try {
                session.endSession();
            } catch (e) {}
        }
    }
};


// PATCH /api/transfers/:id/cancel
const cancelTransfer = async (
    req,
    res,
    next
) => {
    try {
        const transfer =
            await Transfer.findById(
                req.params.id
            );

        if (!transfer) {
            return res.status(404).json({
                success: false,
                message:
                    "Transfer not found",
            });
        }

        const cancellableStatuses = [
            "PENDING",
            "APPROVED",
            "IN_TRANSIT",
        ];

        if (
            !cancellableStatuses.includes(
                transfer.status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This transfer cannot be cancelled",
            });
        }

        transfer.status =
            "CANCELLED";

        await transfer.save();

        await createAuditLog({
            userId: req.auth?.userId || "system",
            action: "TRANSFER_CANCELLED",
            resource: "Transfer",
            resourceId: transfer._id.toString(),
            details: `Cancelled transfer ${transfer.transferNumber}`,
        });

        res.status(200).json({
            success: true,
            message:
                "Transfer cancelled",
            transfer,
        });
    } catch (error) {
        next(error);
    }
};


// GET /api/transfers/stats
const getTransferStats =
    async (req, res, next) => {
        try {
            const stats =
                await Transfer.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: {
                                $sum: 1,
                            },
                        },
                    },
                ]);

            const result = {};

            stats.forEach((item) => {
                result[item._id] =
                    item.count;
            });

            res.status(200).json({
                success: true,
                stats: result,
            });
        } catch (error) {
            next(error);
        }
    };


module.exports = {
    getTransfers,
    getTransfer,
    createTransfer,
    approveTransfer,
    rejectTransfer,
    shipTransfer,
    completeTransfer,
    cancelTransfer,
    getTransferStats,
};