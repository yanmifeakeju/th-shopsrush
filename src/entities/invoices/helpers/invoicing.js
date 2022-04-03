// eslint-disable-next-line import/named
import { storeInvoiceDetails } from '../../../database/repositories/invoices';
import processDiscount from './discount';
import eligibleForDiscount from './eligibility';

export const processInvoice = async (customer, items, discountId) => {
  const gross = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  let discountableItems = [];
  let discount = 0;

  if (discountId) {
    const isEligibleForSelectedDiscount = await eligibleForDiscount(customer, discountId);
    if (!isEligibleForSelectedDiscount.eligible) return { success: false, code: 400, error: isEligibleForSelectedDiscount.message };

    discountableItems = items.map((item) => (item.category !== 'groceries' ? item : null)).filter((item) => item);

    discount = getInvoiceDiscount(discountableItems, isEligibleForSelectedDiscount.rate, isEligibleForSelectedDiscount.type);
  }

  const { invoice, invoiceItems } = await storeInvoiceDetails({ customerId: customer.id, discountId, gross, discount }, items);

  return {
    success: true,
    code: 201,
    message: 'Invoice created successfully',
    data: {
      customer,
      discountableItems,
      data: {
        invoice: { ...invoice, total: invoice.gross - invoice.discount },
        invoiceItems,
      },
    },
  };
};

// Maybe a better abstraction, but for now, this helps me to understand the process
function getInvoiceDiscount(items, rate, type) {
  const discountTypes = ['customer', 'employees', 'affiliate', 'general'];

  if (discountTypes.indexOf(type) === -1) return { success: false, code: 400, error: 'Discount type not found' };

  if (items.length === 0) return 0;

  return processDiscount[type](items, rate);
}
