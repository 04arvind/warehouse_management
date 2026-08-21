const { clerkMiddleware, requireAuth } = require("@clerk/express");

const clerkAuth = clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
});

const requireClerkAuth = requireAuth({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
});

module.exports = {
    clerkAuth,
    requireClerkAuth,
};