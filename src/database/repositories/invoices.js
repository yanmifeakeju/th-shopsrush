import randomstring from 'randomstring';
import logger from '../../utils/logger';
import db from '../connection';

const tableName = 'invoices';
const invoiceItemsTable = 'invoice_items';
const discountTable = 'discounts';

export const storeInvoiceDetails = async ({ customerId, discountId, items: invoiceItemsData }) =>
  db.transaction(async (trx) => {
    try {
      let discount = null;

      if (discountId) {
        discount = await trx(discountTable).where({ id: discountId }).first();
        if (!discount) {
          throw new Error('Discount not found');
        }
      }

      const [invoice] = await trx(tableName)
        .insert({
          billNo: randomstring.generate({ length: 10, charset: 'alphanumeric' }),
          customerId,
          discountId: discount ? discount.id : null,
        })
        .returning('*');

      const invoiceItemsWithInvoiceId = invoiceItemsData.map((item) => ({ ...item, invoiceId: invoice.id }));
      const invoiceItems = await trx(invoiceItemsTable).insert(invoiceItemsWithInvoiceId).returning('*');

      return { invoice, discount, invoiceItems };
    } catch (err) {
      logger.info('Error while storing invoice details', err);

      throw err;
    }
  });

export const getInoviceDataFromBillNo = async (billNo) => db(tableName).where({ billNo }).first().returning('*');
