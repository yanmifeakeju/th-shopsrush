import db from '../connection';

const tableName = 'discounts';

export const storeDiscountDetails = (data) =>
  db(tableName)
    .insert({ ...data })
    .returning('*');

export const allDiscounts = () => db(tableName).select('*').returning('*');

export const findDiscount = (where) => db(tableName).where(where).first().returning('*');
