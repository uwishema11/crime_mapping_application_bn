"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const authRouter = express_1.default.Router();
authRouter.get('/verify-token', verifyAuth_1.default, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});
exports.default = authRouter;
