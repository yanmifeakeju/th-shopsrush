import Joi from 'joi';
import { allDiscounts, findDiscount, storeDiscountDetails } from '../../../database/repositories/discount';

export const createDiscount = async ({ name, description, rate, type }) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    rate: Joi.number().required(),
    type: Joi.string().required().valid('customer', 'employees', 'affilliate'),
  });

  const validation = schema.validate({ name, description, rate, type });
  if (validation.error) return { success: false, code: 400, error: validation.error.message };

  const discount = await storeDiscountDetails({ name, description, rate: rate / 100, type });

  return { success: true, code: 201, message: 'Discount created successfully', data: discount };
};

export const getAllDiscounts = async () => {
  const discounts = await allDiscounts();
  return { success: true, code: 200, message: 'Discounts retrieved successfully', data: discounts };
};

export const retrieveDiscount = async (type) => {
  const discount = await findDiscount({ type });

  if (!discount) return { success: false, code: 404, error: 'Discount not found' };

  return { success: true, code: 200, message: 'Discount retrieved successfully', data: discount };
};
