import ApiError from "../utils/ApiError.js";

const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.user) {
        throw new ApiError(401, "You must be logged in");
    }
    req.user = req.session.user;
    next();
};

export default authMiddleware;
