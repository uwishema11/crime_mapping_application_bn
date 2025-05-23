import Joi from 'joi';

export const crimeCategoryValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  category_author: Joi.string(),
  crimes: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        location: Joi.string().required(),
        reportedAt: Joi.date().required(),
      })
    )
    .optional(),
});
export const crimeValidation = Joi.array().items(
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    location: Joi.string().required(),
    reportedAt: Joi.date().required(),
    userId: Joi.number().required(),
  })
);
