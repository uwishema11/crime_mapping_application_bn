import express from 'express';
import { celebrate } from 'celebrate';
import {
  createCrimeCategoryController,
  getAllCrimeCategoriesController,
  updateCrimeCategoryController,
  deleteCrimeCategoryController,
} from '../controllers/crimeCategory';
import { crimeCategoryValidation } from '../validation/crimes';
import verifyAdmin from '../middleware/verifyAdmin';
import protectedRoute from '../middleware/verifyAuth';

const crimeCategoryRouter = express.Router();

crimeCategoryRouter.post(
  '/create',
  celebrate({ body: crimeCategoryValidation }),
  createCrimeCategoryController
);
crimeCategoryRouter.get(
  '/:id',
  protectedRoute,
  getAllCrimeCategoriesController
);
crimeCategoryRouter.get('/', getAllCrimeCategoriesController);
crimeCategoryRouter.put(
  '/:id',
  protectedRoute,
  verifyAdmin,
  updateCrimeCategoryController
);
crimeCategoryRouter.delete(
  '/:id',
  protectedRoute,
  verifyAdmin,
  deleteCrimeCategoryController
);

export default crimeCategoryRouter;
