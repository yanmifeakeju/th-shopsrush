import { findDiscount } from '../../../database/repositories/discount';

async function eligibleForDiscount(customer, discountId) {
  const getDiscount = await findDiscount({ id: discountId });

  if (!getDiscount) return { eligible: false, message: 'Discount not found' };

  if (getDiscount.type === 'affiliate') {
    return eligibleForAffiliateDiscount(customer, getDiscount);
  }

  if (getDiscount.type === 'employees') {
    return eligibleForEmployeeDiscount(customer, getDiscount);
  }

  if (getDiscount.type === 'customer') {
    return eligibleForCustomerDiscount(customer, getDiscount);
  }

  if (getDiscount.type === 'general') {
    return { eligible: true, rate: getDiscount.rate, type: getDiscount.type };
  }

  return { eligible: false, message: 'Discount type not found' };
}

async function eligibleForAffiliateDiscount(customer, discount) {
  if (!customer.isAffiliate) return { eligible: false, message: 'Customer is not eligible for affiliate discount' };

  return { eligible: true, rate: discount.rate, type: discount.type };
}

async function eligibleForEmployeeDiscount(customer, discount) {
  if (!customer.isEmployee) return { eligible: false, message: 'Customer is not eligible for employee discount' };

  return { eligible: true, rate: discount.rate, type: discount.type };
}

async function eligibleForCustomerDiscount(customer, discount) {
  const now = new Date(Date.now());
  const then = new Date(customer.createdAt);

  const diffInDays = Math.round((now - then) / (1000 * 60 * 60 * 24));
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears < 2) return { eligible: false, message: 'Customer is not eligible for customer discount' };

  return { eligible: true, rate: discount.rate, type: discount.type };
}

export default eligibleForDiscount;
