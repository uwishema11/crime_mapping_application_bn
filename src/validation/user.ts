import Joi from 'joi';

export const userSchema = Joi.object().keys({
  firstName: Joi.string().alphanum().required(),
  lastName: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  role: Joi.string().uppercase().valid('ADMIN', 'USER', 'SUPERADMIN'),
  phone_number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be between 10 and 15 digits',
    }),
  date_of_birth: Joi.date().optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  image_url: Joi.string().uri().optional(),
  password: Joi.string()
    .required()
    .min(6)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .strict(),
  confirm_password: Joi.string().valid(Joi.ref('password')).required().strict(),
});
