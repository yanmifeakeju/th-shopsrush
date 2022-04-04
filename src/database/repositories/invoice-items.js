import db from '../connection';

const tableName = 'invoice_items';

export const retrieveInvoiceItemsWithInvoiceId = async (invoiceId) => db(tableName).where({ invoiceId }).returning('*');
