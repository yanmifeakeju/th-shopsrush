import Joi from 'joi';
import { findCustomerBy } from '../../../database/repositories/customers';
import { retrieveInvoiceItemsWithInvoiceId } from '../../../database/repositories/invoice-items';
import { getInoviceDataFromBillNo } from '../../../database/repositories/invoices';
import { calculateInvoiceData, processInvoice } from '../helpers/invoicing';

export const createInvoice = async ({ customerId, discountId, items }) => {
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
      .required()
      .min(1),
  });

  const validation = schema.validate({ customerId, discountId, items });
  if (validation.error) return { success: false, code: 400, error: validation.error.message };

  const customer = await findCustomerBy({ id: customerId });
  if (!customer) return { success: false, code: 404, error: 'Customer not found' };

  return processInvoice(customer, items, discountId);
};

export const getInvoiceFromBillNo = async ({ billNo }) => {
  const schema = Joi.object().keys({
    billNo: Joi.string().required().length(10),
  });

  const vailidation = schema.validate({ billNo });
  if (vailidation.error) return { success: false, code: 400, error: vailidation.error.message };

  const invoice = await getInoviceDataFromBillNo(billNo);
  if (!invoice) return { success: false, code: 404, error: 'Invoice not found' };

  const invoiceItem = await retrieveInvoiceItemsWithInvoiceId(invoice.id);
  const calculateInvoice = await calculateInvoiceData(invoiceItem, invoice.discountId);
  const customer = await findCustomerBy({ id: invoice.customerId });

  return {
    success: true,
    code: 201,
    message: 'Invoice created successfully',
    data: {
      customer,
      invoice: { ...invoice, ...calculateInvoice.invoice },
      discountedItems: calculateInvoice.discountableItems,
      items: invoiceItem,
    },
  };
};
