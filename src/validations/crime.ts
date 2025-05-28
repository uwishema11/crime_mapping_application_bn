import Joi from 'joi';

export const createCrimeSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  categoryId: Joi.number().required(),
});

export const updateCrimeSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(1000),
  categoryId: Joi.number(),
});
