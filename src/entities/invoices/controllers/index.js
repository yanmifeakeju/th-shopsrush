import Joi from 'joi';

export const createInvoice = async (customerId, { items = [] }) => {
  const schema = Joi.object().keys({
    customerId: Joi.number().required(),
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

  const validation = schema.validate({ customerId, items });
  if (validation.error) return { success: false, code: 400, error: validation.error.message };

  return { success: true, code: 201, message: 'Invoice created successfully', data: { items } };
};
