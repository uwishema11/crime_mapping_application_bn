import express from 'express';
import protectedRoute from '../middleware/verifyAuth';
import {
  createCrimeController,
  deleteCrimeController,
  getAllCrimesController,
  getCrimeByIdController,
  updateCrimeController,
  getCrimesByCategoryController,
  fetchGroupedCrimesByMonthAndType,
  fetchGroupedCrimesByMonth,
  fetchGroupedCrimesByLocation,
  fetchGroupedCrimesByCrimeName,
  fetchLocationWithMostCrimes,
  fetchMostReportedCrime
} from '../controllers/crime';

const Crimerouter = express.Router();

// Public routes
Crimerouter.get('/', getAllCrimesController);
Crimerouter.get('singleCrime/:id', getCrimeByIdController);
Crimerouter.get('/category/:categoryId', getCrimesByCategoryController);
Crimerouter.get('/grouped/monthly', fetchGroupedCrimesByMonth);
Crimerouter.get('/grouped/location', fetchGroupedCrimesByLocation);
Crimerouter.get('/grouped/crime-name', fetchGroupedCrimesByCrimeName);
Crimerouter.get('/grouped/monthAndType', fetchGroupedCrimesByMonthAndType);
Crimerouter.get('/grouped/most-reported-crime', fetchMostReportedCrime);
Crimerouter.get('/location/top-crime-location', fetchLocationWithMostCrimes);
Crimerouter.post('/', protectedRoute, createCrimeController);
Crimerouter.put('/:id', protectedRoute, updateCrimeController);
Crimerouter.delete('/:id', protectedRoute, deleteCrimeController);

export default Crimerouter;
