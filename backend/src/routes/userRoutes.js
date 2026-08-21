const express = require("express");

const {
    getUsers,
} = require("../controllers/userController");

const {
    requireClerkAuth,
} = require("../middleware/auth");

const requireRole =
    require("../middleware/role");

const router = express.Router();


// GET users
// Admin only
router.get(
    "/",
    requireClerkAuth,
    requireRole("ADMIN"),
    getUsers
);


module.exports = router;