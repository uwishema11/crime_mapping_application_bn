"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        res.status(403).json({
            success: false,
            message: 'You are not allowed to perform this action! Only admins are allowed.',
        });
        return;
    }
    next();
};
exports.default = verifyAdmin;
