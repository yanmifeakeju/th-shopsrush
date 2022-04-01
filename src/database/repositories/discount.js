import db from '../connection';

const tableName = 'discounts';

export const storeDiscountDetails = (data) =>
  db(tableName)
    .insert({ ...data })
    .returning('*');
