// eslint-disable-next-line import/named
import { findDiscount } from '../../../database/repositories/discount';
import { storeInvoiceDetails } from '../../../database/repositories/invoices';
import processDiscount from './discount';
import eligibleForDiscount from './eligibility';

export const processInvoice = async (customer, items, discountId) => {
  if (discountId) {
    const isEligibleForSelectedDiscount = await eligibleForDiscount(customer, discountId);
    if (!isEligibleForSelectedDiscount.eligible) return { success: false, code: 400, error: isEligibleForSelectedDiscount.message };
  }

  const { invoice, discount, invoiceItems } = await storeInvoiceDetails({ customerId: customer.id, discountId, items });

  const gross = invoiceItems.reduce((acc, item) => acc + Number(item.quantity) * Number(item.price), 0);
  let discountableItems = [];
  let discounted = 0;

  if (discount) {
    discountableItems = invoiceItems.map((item) => (item.category !== 'groceries' ? item : null)).filter((item) => item);

    discounted = getInvoiceDiscount(discountableItems, discount.rate, discount.type);
  }

  return {
    success: true,
    code: 201,
    message: 'Invoice created successfully',
    data: {
      customer,
      discountableItems,
      invoice: { ...invoice, gross, discounted, total: gross - discounted },
      invoiceItems,
    },
  };
};

export const calculateInvoiceData = async (items, discountId) => {
  const gross = items.reduce((acc, item) => acc + Number(item.quantity) * Number(item.price), 0);
  const discount = await findDiscount({ id: discountId });
  let discountableItems = [];
  let discounted = 0;

  if (discount) {
    discountableItems = items.map((item) => (item.category !== 'groceries' ? item : null)).filter((item) => item);
    discounted = getInvoiceDiscount(discountableItems, discount.rate, discount.type);
  }

  return { discountableItems, invoice: { gross, discounted, total: gross - discounted } };
};

// Maybe a better abstraction, but for now, this helps me to understand the process
function getInvoiceDiscount(items, rate, type) {
  const discountTypes = ['customer', 'employees', 'affiliate', 'general'];

  if (discountTypes.indexOf(type) === -1) return { success: false, code: 400, error: 'Discount type not found' };

  if (items.length === 0) return 0;

  return processDiscount[type](items, rate);
}
