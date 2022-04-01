import Joi from 'joi';

export const createCustomer = async ({ firstName, lastName, email, isEmployee = false }) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    isEmployee: Joi.boolean(),
  });

  const validation = schema.validate({ firstName, lastName, email, isEmployee });
  if (validation.error) return { success: false, code: 400, error: validation.error.message };

  return { success: true, code: 200, message: 'Customer created successfully', data: { firstName, lastName, email, isEmployee } };
};
