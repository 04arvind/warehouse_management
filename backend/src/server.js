require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

const { clerkAuth } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Routes
const warehouseRoutes = require("./routes/warehouseRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const transferRoutes = require("./routes/transferRoutes");
const userRoutes = require("./routes/userRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

connectDB();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header
            // (Postman, server-to-server, health checks, etc.)
            if (!origin) {
                return callback(null, true);
            }

            // Allow configured origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow Vercel preview/production deployments
            if (origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            // Reject unknown origins
            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,
    })
);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Warehouse Management API is running",
        environment: process.env.NODE_ENV || "development",
    });
});

/*
|--------------------------------------------------------------------------
| Clerk Authentication
|--------------------------------------------------------------------------
*/

app.use(clerkAuth);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
    });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Local Development Server
|--------------------------------------------------------------------------
|
| Vercel automatically handles the exported Express application.
| app.listen() is only used when running locally.
|
*/

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(
            `Server running on http://localhost:${PORT}`
        );
    });
}

/*
|--------------------------------------------------------------------------
| Export App
|--------------------------------------------------------------------------
*/

module.exports = app;