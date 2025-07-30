"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const crime_1 = require("../controllers/crime");
const Crimerouter = express_1.default.Router();
// Public routes
Crimerouter.get('/', crime_1.getAllCrimesController);
Crimerouter.get('singleCrime/:id', crime_1.getCrimeByIdController);
Crimerouter.get('/category/:categoryId', crime_1.getCrimesByCategoryController);
Crimerouter.get('/grouped/monthly', crime_1.fetchGroupedCrimesByMonth);
Crimerouter.get('/grouped/location', crime_1.fetchGroupedCrimesByLocation);
Crimerouter.get('/grouped/crime-name', crime_1.fetchGroupedCrimesByCrimeName);
Crimerouter.get('/grouped/monthAndType', crime_1.fetchGroupedCrimesByMonthAndType);
Crimerouter.get('/grouped/most-reported-crime', crime_1.fetchMostReportedCrime);
Crimerouter.get('/location/top-crime-location', crime_1.fetchLocationWithMostCrimes);
Crimerouter.post('/', verifyAuth_1.default, crime_1.createCrimeController);
Crimerouter.put('/:id', verifyAuth_1.default, crime_1.updateCrimeController);
Crimerouter.delete('/:id', verifyAuth_1.default, crime_1.deleteCrimeController);
exports.default = Crimerouter;
