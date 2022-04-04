import { mocked } from 'jest-mock';
import { createInvoice } from '.';
import { findCustomerBy } from '../../../database/repositories/customers';
import { findDiscount } from '../../../database/repositories/discount';
import { generateArrayofItems, generateCustomerRequest, returnRandomItem } from '../../../utils/test-utils/generate';

jest.mock('../../../database/repositories/customers');
jest.mock('../../../database/repositories/discount');

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
  });

  describe('Customer eligible for discount', () => {});
});
