"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const celebrate_1 = require("celebrate");
const storage_1 = require("../utils/storage");
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const user_1 = require("../controllers/user");
const user_2 = require("../validation/user");
const userController_1 = __importDefault(require("../controllers/userController"));
const userRouter = express_1.default.Router();
userRouter.get('/', verifyAuth_1.default, user_1.fetchUsers);
userRouter.post('/auth/register', storage_1.uploadImg, (0, celebrate_1.celebrate)({ body: user_2.userSchema }), user_1.registerUser);
userRouter.delete('/delete/:id', verifyAuth_1.default, verifyAdmin_1.default, user_1.deleteUser);
userRouter.post('/auth/login', user_1.login);
userRouter.patch('/update/:id', storage_1.uploadImg, user_1.updateUser);
// Update user role (admin only)
userRouter.patch('/:userId/role', verifyAuth_1.default, verifyAdmin_1.default, (0, celebrate_1.celebrate)({
    params: celebrate_1.Joi.object({
        userId: celebrate_1.Joi.number().required(),
    }),
    body: celebrate_1.Joi.object({
        role: celebrate_1.Joi.string()
            .valid('USER', 'OFFICER', 'ADMIN', 'SUPERADMIN')
            .required(),
    }),
}), userController_1.default.updateUserRole);
// Get all officers (admin only)
userRouter.get('/officers', verifyAuth_1.default, verifyAdmin_1.default, userController_1.default.getOfficers);
// Get assigned reports (officer only)
// userRouter.get(
//   '/assigned-reports',
//   protectedRoute,
//   userController.getAssignedReports
// );
exports.default = userRouter;
