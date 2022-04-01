import { mocked } from 'jest-mock';
import { storeCustomerDetails } from '../../../database/repositories/customers';
import { generateCustomerRequest } from '../../../utils/test-utils/generate';
import { createCustomer } from './create-customer';

jest.mock('../../../database/repositories/customers');

describe('Create Customer', () => {
  describe('Validation: Required Fields', () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNo'];
    const data = generateCustomerRequest();

    requiredFields.forEach((field) => {
      const incompleteData = { ...data, [field]: undefined };

      it(`should return an error if ${field} is missing`, async () => {
        const response = await createCustomer({ ...incompleteData });

        expect(response.success).toBe(false);
        expect(response.code).toBe(400);
        expect(response.error).toBe(`"${field}" is required`);
      });
    });
  });

  it('should return success response if customer is created successfully', async () => {
    const data = generateCustomerRequest();
    mocked(storeCustomerDetails).mockResolvedValue({ ...data });

    const response = await createCustomer(data);

    expect(storeCustomerDetails).toHaveBeenCalledWith(data);
    expect(response.success).toBe(true);
    expect(response.code).toBe(200);
    expect(response.message).toBe('Customer created successfully');
    expect(response.data).toEqual(data);
  });
});
