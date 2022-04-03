import Joi from 'joi';
import { findCustomerBy } from '../../../database/repositories/customers';
import { processInvoice } from '../helpers/invoicing';

export const createInvoice = async (customerId, { discountId, items = [] }) => {
  const schema = Joi.object().keys({
    customerId: Joi.number().required(),
    discountId: Joi.number(),
    items: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          quantity: Joi.number().required(),
          price: Joi.number().required(),
          category: Joi.string().valid('groceries', 'electronics', 'furniture').required(),
        })
      )
      .required(),
  });

  const validation = schema.validate({ customerId, discountId, items });
  if (validation.error) return { success: false, code: 400, error: validation.error.message };

  const customer = await findCustomerBy({ id: customerId });
  if (!customer) return { success: false, code: 404, error: 'Customer not found' };

  return processInvoice(customer, items, discountId);
};
