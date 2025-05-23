"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const celebrate_1 = require("celebrate");
const crimeCategory_1 = require("../controllers/crimeCategory");
const crimes_1 = require("../validation/crimes");
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const crimeCategoryRouter = express_1.default.Router();
crimeCategoryRouter.post('/create', (0, celebrate_1.celebrate)({ body: crimes_1.crimeCategoryValidation }), crimeCategory_1.createCrimeCategoryController);
crimeCategoryRouter.get('/:id', verifyAuth_1.default, crimeCategory_1.getAllCrimeCategoriesController);
crimeCategoryRouter.get('/', crimeCategory_1.getAllCrimeCategoriesController);
crimeCategoryRouter.put('/:id', verifyAuth_1.default, verifyAdmin_1.default, crimeCategory_1.updateCrimeCategoryController);
crimeCategoryRouter.delete('/:id', verifyAuth_1.default, verifyAdmin_1.default, crimeCategory_1.deleteCrimeCategoryController);
exports.default = crimeCategoryRouter;
