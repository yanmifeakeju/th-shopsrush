import logger from '../../utils/logger';
import db from '../connection';

const tableName = 'invoices';
const invoiceItemsTable = 'invoice_items';

export const storeInvoiceDetails = async (invoiceData, invoiceItemsData) =>
  db.transaction(async (trx) => {
    try {
      const { customerId, discountId, gross, discount } = invoiceData;

      const [invoice] = await trx(tableName)
        .insert({
          customerId,
          discountId: discountId || null,
          gross: gross.toFixed(2),
          discount: discount ? discount.toFixed(2) : 0,
        })
        .returning('*');

      const invoiceItemsWithInvoiceId = invoiceItemsData.map((item) => ({ ...item, invoiceId: invoice.id }));
      const invoiceItems = await trx(invoiceItemsTable).insert(invoiceItemsWithInvoiceId).returning('*');

      return { invoice, invoiceItems };
    } catch (err) {
      logger.info('Error while storing invoice details', err);

      throw err;
    }
  });
