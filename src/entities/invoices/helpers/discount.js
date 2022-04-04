const processDiscount = {
  general: processGeneralDiscount,
  affiliate: processAffiliateDiscount,
  customer: processCustomerDiscount,
  employees: processEmployeeDiscount,
};

function processGeneralDiscount(items, rate) {
  const total = items.reduce((acc, item) => acc + item.price, 0);
  const baseDiscount = 100 * rate;
  const discountedTotal = Math.floor(total / 100);

  const discount = discountedTotal * baseDiscount;
  return discount;
}

function processAffiliateDiscount(items, rate) {
  const total = items.reduce((acc, item) => acc + item.price, 0);
  const discount = total * rate;

  return discount;
}

function processCustomerDiscount(items, rate) {
  const total = items.reduce((acc, item) => acc + item.price, 0);
  const discount = total * rate;

  return discount;
}

function processEmployeeDiscount(items, rate) {
  const total = items.reduce((acc, item) => acc + item.price, 0);
  const discount = total * rate;

  return discount;
}

export default processDiscount;
