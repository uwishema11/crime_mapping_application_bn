import Joi from 'joi';

export const createReportSchema = Joi.object({
  crimeId: Joi.number().required(),
  description: Joi.string().required().min(10).max(1000),
  location: Joi.string().required().min(5).max(200),
  incidentDate: Joi.date().required().max('now'),
  evidence: Joi.string().uri().allow(''),
  contactNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow(''),
  categoryId: Joi.number().required(),
});

export const updateReportStatusSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'RESOLVED', 'REJECTED')
    .required(),
}); 