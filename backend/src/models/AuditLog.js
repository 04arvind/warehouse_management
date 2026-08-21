const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        action: {
            type: String,
            required: true,
            trim: true,
        },

        resource: {
            type: String,
            required: true,
            trim: true,
        },

        resourceId: {
            type: String,
            default: null,
        },

        details: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "AuditLog",
    auditLogSchema
);