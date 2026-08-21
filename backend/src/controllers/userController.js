const getUsers = async (
    req,
    res,
    next
) => {
    try {
        /*
          User management will be handled
          through Clerk.
    
          We will connect the Clerk Backend
          API here when building admin routes.
        */

        res.status(200).json({
            success: true,
            users: [],
            message:
                "Users are managed through Clerk",
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getUsers,
};