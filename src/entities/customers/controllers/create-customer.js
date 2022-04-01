import Joi from 'joi';
import { storeCustomerDetails } from '../../../database/repositories/customers';

export const createCustomer = async ({ firstName, lastName, email, phoneNo, isEmployee = false, isAffiliate = false }) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    isEmployee: Joi.boolean(),
    isAffiliate: Joi.boolean(),
    phoneNo: Joi.string()
      .regex(/^234[789][01]\d{8}$/)
      .message('Invalid phone number')
      .required(),
  });

  const validation = schema.validate({ firstName, lastName, email, phoneNo, isEmployee, isAffiliate });
  if (validation.error) return { success: false, code: 400, error: validation.error.message };

  const customer = await storeCustomerDetails({ firstName, lastName, email, isEmployee, isAffiliate, phoneNo });

  return { success: true, code: 200, message: 'Customer created successfully', data: customer };
};
