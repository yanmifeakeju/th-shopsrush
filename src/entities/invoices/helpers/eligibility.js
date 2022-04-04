import { findDiscount } from '../../../database/repositories/discount';

async function eligibleForDiscount(customer, discountId) {
  const getDiscount = await findDiscount({ id: discountId });

  if (!getDiscount) return { eligible: false, message: 'Discount not found' };

  if (getDiscount.type === 'affiliate') {
    return eligibleForAffiliateDiscount(customer);
  }

  if (getDiscount.type === 'employees') {
    return eligibleForEmployeeDiscount(customer);
  }

  if (getDiscount.type === 'customer') {
    return eligibleForCustomerDiscount(customer);
  }

  if (getDiscount.type === 'general') {
    return { eligible: true };
  }

  return { eligible: false, message: 'Discount type not found' };
}

async function eligibleForAffiliateDiscount(customer) {
  if (!customer.isAffiliate) return { eligible: false, message: 'Customer is not eligible for affiliate discount' };

  return { eligible: true };
}

async function eligibleForEmployeeDiscount(customer) {
  if (!customer.isEmployee) return { eligible: false, message: 'Customer is not eligible for employee discount' };

  return { eligible: true };
}

async function eligibleForCustomerDiscount(customer) {
  const now = new Date(Date.now());
  const then = new Date(customer.createdAt);

  const diffInDays = Math.round((now - then) / (1000 * 60 * 60 * 24));
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears < 2) return { eligible: false, message: 'Customer is not eligible for customer discount' };

  return { eligible: true };
}

export default eligibleForDiscount;
