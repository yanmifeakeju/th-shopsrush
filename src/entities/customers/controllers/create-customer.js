import Joi from 'joi';
import {
  findCustomerBy,
  findCustomers,
  findExistingCustomerOnSignup,
  findWhereCustomerLike,
  storeCustomerDetails,
} from '../../../database/repositories/customers';

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

  const isExistingCustomer = await findExistingCustomerOnSignup(email, phoneNo);

  if (isExistingCustomer && isExistingCustomer.email === email) return { success: false, code: 400, error: 'Email already registered' };

  if (isExistingCustomer && isExistingCustomer.phoneNo === phoneNo) return { success: false, code: 400, error: 'Phone number already registered' };

  const customer = await storeCustomerDetails({ firstName, lastName, email, isEmployee, isAffiliate, phoneNo });

  return { success: true, code: 200, message: 'Customer created successfully', data: customer };
};

export const findAllCustomers = async (filter) => {
  if (Object.keys(filter).length > 0) {
    if (!filter.name) {
      return { success: false, code: 400, error: 'Invalid fitler query' };
    }
    const customersFindCustomers = await Promise.all([
      ...[findWhereCustomerLike(['firstName', 'like', `%${filter.name}%`]), findWhereCustomerLike(['lastName', 'like', `%${filter.name}%`])],
    ]);

    const customers = customersFindCustomers.reduce((acc, curr) => [...acc, ...curr], []);
    const uniqueCustomerValues = [...new Map(customers.map((item) => [item.id, item])).values()];

    return {
      success: true,
      code: 200,
      message: `Customers found successfully where first or last name contains ${filter.name}`,
      data: uniqueCustomerValues,
    };
  }

  const customers = await findCustomers();
  return { success: true, code: 200, message: 'Customers retrieved successfully', data: customers };
};

export const findCustomer = async (id) => {
  const customer = await findCustomerBy({ id });
  if (!customer) return { success: false, code: 404, error: 'Customer not found' };
  return { success: true, code: 200, message: 'Customer retrieved successfully', data: customer };
};
