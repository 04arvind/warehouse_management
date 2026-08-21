const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true,
        },

        sku: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        minimumStock: {
            type: Number,
            min: 0,
            default: 10,
        },
    },
    {
        timestamps: true,
    }
);

/*
 * A warehouse cannot have the same SKU
 * more than once.
 */
inventorySchema.index(
    {
        warehouse: 1,
        sku: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model(
    "Inventory",
    inventorySchema
);