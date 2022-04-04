import { mocked } from 'jest-mock';
import { createInvoice } from '.';
import { findCustomerBy } from '../../../database/repositories/customers';
import { findDiscount } from '../../../database/repositories/discount';
import { storeInvoiceDetails } from '../../../database/repositories/invoices';
import { generateArrayofItems, generateCustomerRequest, returnRandomItem } from '../../../utils/test-utils/generate';
import processDiscount from '../helpers/discount';

jest.mock('../../../database/repositories/customers');
jest.mock('../../../database/repositories/discount');
jest.mock('../../../database/repositories/invoices');

afterAll(() => jest.clearAllMocks());

describe('Create Invoice', () => {
  describe('Bad Arguments', () => {
    it('should return error if customerId is not provided', async () => {
      const response = await createInvoice({ discountId: 4, items: generateArrayofItems() });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('"customerId" is required');
    });
    it('should return error if items is not provided', async () => {
      const response = await createInvoice({ customerId: 4, discountId: 4 });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('"items" is required');
    });

    it('should return error if items is not an array', async () => {
      const response = await createInvoice({ customerId: 4, discountId: 4, items: 'not an array' });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('"items" must be an array');
    });

    it('should return error if items is an empty array', async () => {
      const response = await createInvoice({ customerId: 4, discountId: 4, items: [] });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('"items" must contain at least 1 items');
    });

    it('should return error if customerId is not a number', async () => {
      const response = await createInvoice({ customerId: 'not a number', discountId: 4, items: generateArrayofItems() });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('"customerId" must be a number');
    });

    describe('should return error if items is an array missing required fields', () => {
      const requiredFields = ['name', 'quantity', 'price', 'category'];

      requiredFields.forEach((field) => {
        const items = generateArrayofItems(5);
        const randomIndex = Math.floor(Math.random() * items.length);
        const invalidItem = { ...returnRandomItem(items) };
        delete invalidItem[field];

        items[randomIndex] = invalidItem;

        it(`should return error if items is an array missing required field ${field}`, async () => {
          const response = await createInvoice({ customerId: 4, discountId: 4, items });
          expect(response.success).toBe(false);
          expect(response.code).toBe(400);
          expect(response.error).toBe(`"items[${randomIndex}].${field}" is required`);
        });
      });
    });
  });

  it('should return error if customerId has no corresponding customer', async () => {
    mocked(findCustomerBy).mockResolvedValueOnce(null);

    const response = await createInvoice({ customerId: 4, discountId: 4, items: generateArrayofItems() });

    expect(response.success).toBe(false);
    expect(response.code).toBe(404);
    expect(response.error).toBe('Customer not found');
  });

  describe('Customer not eligble for discount', () => {
    it('should return error if customer is not eligible for affiliate discount', async () => {
      const customer = { ...generateCustomerRequest(), isAffiliate: false };
      mocked(findCustomerBy).mockResolvedValueOnce(customer);
      mocked(findDiscount).mockResolvedValueOnce({ rate: 0.4, type: 'affiliate' });

      const response = await createInvoice({ customerId: 4, discountId: 4, items: generateArrayofItems() });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('Customer is not eligible for affiliate discount');
    });

    it('should return error if customer is not eligible for customer discount', async () => {
      const customer = { ...generateCustomerRequest(), isAffiliate: true };
      mocked(findCustomerBy).mockResolvedValueOnce({ ...customer, createdAt: new Date(Date.now()) });
      mocked(findDiscount).mockResolvedValueOnce({ rate: 0.4, type: 'customer' });

      const response = await createInvoice({ customerId: 4, discountId: 4, items: generateArrayofItems() });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('Customer is not eligible for customer discount');
    });

    it('should  return error if customer is not eligible for employee discount', async () => {
      const customer = { ...generateCustomerRequest(), isAffiliate: true };
      mocked(findCustomerBy).mockResolvedValueOnce({ ...customer, isEmployee: false });
      mocked(findDiscount).mockResolvedValueOnce({ rate: 0.4, type: 'employees' });

      const response = await createInvoice({ customerId: 4, discountId: 4, items: generateArrayofItems() });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('Customer is not eligible for employee discount');
    });

    it('should  return  error if no discount with  discountId', async () => {
      const customer = { ...generateCustomerRequest(), isAffiliate: true };
      mocked(findCustomerBy).mockResolvedValueOnce({ ...customer, isEmployee: true });
      mocked(findDiscount).mockResolvedValueOnce(null);

      const response = await createInvoice({ customerId: 4, discountId: 4, items: generateArrayofItems() });

      expect(response.success).toBe(false);
      expect(response.code).toBe(400);
      expect(response.error).toBe('Discount not found');
    });
  });

  describe('Customer eligible for discount', () => {
    const generetedItems = generateArrayofItems(10);
    const gross = generetedItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

    it('should return success response if customer is eligible for affiliate discount', async () => {
      const customer = { ...generateCustomerRequest(), isAffiliate: true };

      mocked(findCustomerBy).mockResolvedValueOnce(customer);
      mocked(findDiscount).mockResolvedValueOnce({ rate: 0.3, type: 'affiliate' });
      mocked(storeInvoiceDetails).mockResolvedValueOnce({ invoice: {}, discount: { rate: 0.3, type: 'affiliate' }, invoiceItems: generetedItems });

      const discountedItems = generetedItems.filter((item) => item.category !== 'groceries');
      const discounted = processDiscount.affiliate(discountedItems, 0.3);

      const response = await createInvoice({ customerId: 4, discountId: 4, items: generetedItems });

      expect(response.success).toBe(true);
      expect(response.code).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.discountableItems).toMatchObject(discountedItems);
      expect(response.data.invoice.discounted).toBe(discounted);
      expect(response.data.invoice.gross).toBe(gross);
    });

    it('should return success response if customer is eligible for customer discount', async () => {
      const customer = { ...generateCustomerRequest(), isAffiliate: false, isEmployee: false };

      mocked(findCustomerBy).mockResolvedValueOnce({ ...customer, createdAt: new Date('2015-01-01') });
      mocked(findDiscount).mockResolvedValueOnce({ rate: 0.05, type: 'customer' });
      mocked(storeInvoiceDetails).mockResolvedValueOnce({ invoice: {}, discount: { rate: 0.05, type: 'affiliate' }, invoiceItems: generetedItems });

      const discountedItems = generetedItems.filter((item) => item.category !== 'groceries');
      const discounted = processDiscount.customer(discountedItems, 0.05);

      const response = await createInvoice({ customerId: 4, discountId: 4, items: generetedItems });

      expect(response.success).toBe(true);
      expect(response.code).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.discountableItems).toMatchObject(discountedItems);
      expect(response.data.invoice.discounted).toBe(discounted);
      expect(response.data.invoice.gross).toBe(gross);
    });

    it('should  return success response if customer is eligible for employee discount', async () => {
      const customer = { ...generateCustomerRequest(), isEmployee: true };

      mocked(findCustomerBy).mockResolvedValueOnce({ ...customer });
      mocked(findDiscount).mockResolvedValueOnce({ rate: 0.3, type: 'customer' });
      mocked(storeInvoiceDetails).mockResolvedValueOnce({ invoice: {}, discount: { rate: 0.3, type: 'affiliate' }, invoiceItems: generetedItems });

      const discountedItems = generetedItems.filter((item) => item.category !== 'groceries');
      const discounted = processDiscount.employees(discountedItems, 0.3);

      const response = await createInvoice({ customerId: 4, discountId: 4, items: generetedItems });

      expect(response.success).toBe(true);
      expect(response.code).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.discountableItems).toMatchObject(discountedItems);
      expect(response.data.invoice.discounted).toBe(discounted);
      expect(response.data.invoice.gross).toBe(gross);
    });

    it('should correctly calculate general  discount', async () => {
      const customer = { ...generateCustomerRequest() };

      mocked(findCustomerBy).mockResolvedValueOnce({ ...customer });
      mocked(findDiscount).mockResolvedValueOnce({ rate: 0.05, type: 'general' });
      mocked(storeInvoiceDetails).mockResolvedValueOnce({ invoice: {}, discount: { rate: 0.05, type: 'general' }, invoiceItems: generetedItems });

      const discountedItems = generetedItems.filter((item) => item.category !== 'groceries');
      const discounted = processDiscount.general(discountedItems, 0.05);

      const response = await createInvoice({ customerId: 4, discountId: 4, items: generetedItems });

      expect(response.success).toBe(true);
      expect(response.code).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.discountableItems).toMatchObject(discountedItems);
      expect(response.data.invoice.discounted).toBe(discounted);
      expect(response.data.invoice.gross).toBe(gross);
    });
  });
});
