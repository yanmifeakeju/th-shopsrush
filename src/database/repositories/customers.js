import db from '../connection';

const tableName = 'customers';

export const storeCustomerDetails = (data) =>
  db(tableName)
    .insert({ ...data })
    .returning('*');

export const findCustomerBy = (value) => db(tableName).where(value).first().returning('*');

export const findExistinCustomerOnSignup = (email, phoneNo) => db(tableName).where({ email }).orWhere({ phoneNo }).first().returning('*');
