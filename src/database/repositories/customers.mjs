import db from '../connection.mjs';

const tableName = 'customers';

export const storeCustomerDetails = (data) => db(tableName).insert({ ...data });
