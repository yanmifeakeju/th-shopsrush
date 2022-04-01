import db from '../connection';

const tableName = 'customers';

export const storeCustomerDetails = (data) =>
  db(tableName)
    .insert({ ...data })
    .returning('*');

export const findCustomerBy = (value) => db(tableName).where(value).first().returning('*');

export const findCustomers = (filter = {}) => db(tableName).select('*').where(filter).returning('*');

export const findWhereCustomerLike = (value) => db(tableName).where(value[0], value[1], value[2]).returning('*');

export const findExistingCustomerOnSignup = (email, phoneNo) => db(tableName).where({ email }).orWhere({ phoneNo }).first().returning('*');
