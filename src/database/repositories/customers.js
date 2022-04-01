import db from '../connection';

const tableName = 'customers';

export const storeCustomerDetails = (data) => db(tableName).insert({ ...data });
