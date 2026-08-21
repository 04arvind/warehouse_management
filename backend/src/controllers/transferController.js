const mongoose = require("mongoose");

const Transfer = require("../models/Transfer");
const Inventory = require("../models/Inventory");
const Warehouse = require("../models/Warehouse");


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
                    "name code"
                )
                .populate(
                    "destinationWarehouse",
                    "name code"
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
            const inventory =
                await Inventory.findOne({
                    _id: item.inventory,
                    warehouse:
                        sourceWarehouse,
                });

            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message:
                        `Inventory item ${item.inventory} not found in source warehouse`,
                });
            }

            if (
                !item.quantity ||
                item.quantity <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Quantity must be greater than 0",
                });
            }

            if (
                item.quantity >
                inventory.quantity
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Insufficient stock for ${inventory.name}`,
                });
            }

            transferItems.push({
                inventory:
                    inventory._id,
                sku: inventory.sku,
                name: inventory.name,
                quantity: item.quantity,
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
                    req.auth.userId,

                notes,
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
            req.auth.userId;

        await transfer.save();

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
    const session =
        await mongoose.startSession();

    try {
        session.startTransaction();

        const transfer =
            await Transfer.findById(
                req.params.id
            ).session(session);

        if (!transfer) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message:
                    "Transfer not found",
            });
        }

        if (
            transfer.status !==
            "IN_TRANSIT"
        ) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message:
                    "Only in-transit transfers can be completed",
            });
        }

        // Update source inventory
        for (
            const item of transfer.items
        ) {
            const sourceInventory =
                await Inventory.findOne({
                    _id: item.inventory,
                    warehouse:
                        transfer.sourceWarehouse,
                }).session(session);

            if (!sourceInventory) {
                throw new Error(
                    `Source inventory not found for ${item.sku}`
                );
            }

            if (
                sourceInventory.quantity <
                item.quantity
            ) {
                throw new Error(
                    `Insufficient stock for ${item.sku}`
                );
            }

            sourceInventory.quantity -=
                item.quantity;

            await sourceInventory.save({
                session,
            });

            // Find destination inventory
            let destinationInventory =
                await Inventory.findOne({
                    warehouse:
                        transfer.destinationWarehouse,
                    sku: item.sku,
                }).session(session);

            // Create destination item if it doesn't exist
            if (!destinationInventory) {
                destinationInventory =
                    new Inventory({
                        warehouse:
                            transfer.destinationWarehouse,

                        sku: item.sku,

                        name: item.name,

                        quantity: 0,

                        minimumStock: 10,
                    });
            }

            destinationInventory.quantity +=
                item.quantity;

            await destinationInventory.save({
                session,
            });
        }

        transfer.status =
            "COMPLETED";

        transfer.completedBy =
            req.auth.userId;

        transfer.completedAt =
            new Date();

        await transfer.save({
            session,
        });

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message:
                "Transfer completed and stock updated",
            transfer,
        });
    } catch (error) {
        await session.abortTransaction();

        next(error);
    } finally {
        session.endSession();
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