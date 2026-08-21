const { clerkMiddleware, requireAuth } = require("@clerk/express");

/*
 * Initializes Clerk for the Express application.
 *
 * Add this middleware near the top of server.js:
 *
 * app.use(clerkMiddleware());
 */

const clerkAuth = clerkMiddleware();

/*
 * Protects a route.
 *
 * The request must contain a valid Clerk session/token.
 *
 * After successful authentication:
 *
 * req.auth.userId
 *
 * will contain the authenticated Clerk user ID.
 */

const requireClerkAuth = requireAuth();

module.exports = {
    clerkAuth,
    requireClerkAuth,
};