import Joi from 'joi';
import { storeDiscountDetails } from '../../../database/repositories/discount';

export const createDiscount = async ({ name, description, rate, discountLevel }) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    rate: Joi.number().required(),
    discountLevel: Joi.string().required(),
  });

  const validation = schema.validate({ name, description, rate, discountLevel });
  if (validation.error) return { success: false, code: 400, error: validation.error.message };

  const discount = await storeDiscountDetails({ name, description, rate: rate / 100, discountLevel });

  return { success: true, code: 201, message: 'Discount created successfully', data: discount };
};
