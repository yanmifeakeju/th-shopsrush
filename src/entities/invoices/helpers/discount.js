const processDiscount = {
  general: processGeneralDiscount,
  affiliate: processAffiliateDiscount,
  customer: processCustomerDiscount,
  employees: processEmployeeDiscount,
};

// Code duplication, but requirement could change in the future and each case should be handled separately
// Probably needs a better abstraction, but for now, this helps simplify the process

function processGeneralDiscount(items, rate) {
  const total = items.reduce((acc, item) => Number(acc) + Number(item.price), 0);

  const baseDiscount = 100 * Number(rate);
  const discountedTotal = Math.floor(total / 100);

  const discount = Number(discountedTotal) * Number(baseDiscount);

  return discount.toFixed(2);
}

function processAffiliateDiscount(items, rate) {
  const total = items.reduce((acc, item) => Number(acc) + Number(item.price), 0);

  const discount = total * rate;

  return discount.toFixed(2);
}

function processCustomerDiscount(items, rate) {
  const total = items.reduce((acc, item) => Number(acc) + Number(item.price), 0);
  const discount = total * rate;

  return discount.toFixed(2);
}

function processEmployeeDiscount(items, rate) {
  const total = items.reduce((acc, item) => Number(acc) + Number(item.price), 0);
  const discount = total * rate;

  return discount.toFixed(2);
}

export default processDiscount;
