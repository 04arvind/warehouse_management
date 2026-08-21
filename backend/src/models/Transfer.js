const mongoose = require("mongoose");

const transferItemSchema = new mongoose.Schema(
    {
        inventory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true,
        },

        sku: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        _id: false,
    }
);

const transferSchema = new mongoose.Schema(
    {
        transferNumber: {
            type: String,
            required: true,
            unique: true,
        },

        sourceWarehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true,
        },

        destinationWarehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true,
        },

        items: {
            type: [transferItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "At least one transfer item is required",
            },
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED",
                "IN_TRANSIT",
                "COMPLETED",
                "CANCELLED",
            ],
            default: "PENDING",
        },

        requestedBy: {
            type: String,
            required: true,
        },

        approvedBy: {
            type: String,
            default: null,
        },

        completedBy: {
            type: String,
            default: null,
        },

        rejectionReason: {
            type: String,
            default: null,
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Transfer",
    transferSchema
);