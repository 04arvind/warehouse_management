require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB =
    require("./config/db");

const {
    clerkAuth,
} = require("./middleware/auth");

const errorHandler =
    require("./middleware/errorHandler");

// Routes
const warehouseRoutes =
    require("./routes/warehouseRoutes");

const inventoryRoutes =
    require("./routes/inventoryRoutes");

const transferRoutes =
    require("./routes/transferRoutes");

const userRoutes =
    require("./routes/userRoutes");

const auditRoutes =
    require("./routes/auditRoutes");


const app = express();


// Database
connectDB();


// CORS
app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",
        credentials: true,
    })
);


// Body parser
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);


// Logger
app.use(morgan("dev"));


// Clerk
app.use(clerkAuth);


// Health check
app.get(
    "/api/health",
    (req, res) => {
        res.status(200).json({
            success: true,
            message:
                "Warehouse Management API is running",
        });
    }
);


// API routes
app.use(
    "/api/warehouses",
    warehouseRoutes
);

app.use(
    "/api/inventory",
    inventoryRoutes
);

app.use(
    "/api/transfers",
    transferRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/audit-logs",
    auditRoutes
);


// 404 handler
app.use(
    (req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found",
        });
    }
);


// Global error handler
app.use(errorHandler);


const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {
        console.log(
            `Server running on port ${PORT}`
        );
    }
);