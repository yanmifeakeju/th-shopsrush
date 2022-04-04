import { mocked } from 'jest-mock';
import { findExistingCustomerOnSignup, storeCustomerDetails } from '../../../database/repositories/customers';
import { generateCustomerRequest } from '../../../utils/test-utils/generate';
import { createCustomer } from '.';

jest.mock('../../../database/repositories/customers');

describe('Create Customer', () => {
  beforeEach(() => jest.restoreAllMocks());
  const data = generateCustomerRequest();

  describe('Validation: Required Fields', () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNo'];
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

  it('should return an error if email is already registered', async () => {
    mocked(findExistingCustomerOnSignup).mockResolvedValueOnce({ email: data.email });
    mocked(storeCustomerDetails).mockResolvedValueOnce(data);

    const response = await createCustomer({ ...data });

    expect(response.success).toBe(false);
    expect(response.code).toBe(400);
    expect(response.error).toBe('Email already registered');
  });

  it('should return an error if phone number is already registered', async () => {
    mocked(findExistingCustomerOnSignup).mockResolvedValueOnce({ phoneNo: data.phoneNo });
    mocked(storeCustomerDetails).mockResolvedValueOnce(data);

    const response = await createCustomer({ ...data });

    expect(response.success).toBe(false);
    expect(response.code).toBe(400);
    expect(response.error).toBe('Phone number already registered');
  });

  it('should return successful response if customer is created successfully', async () => {
    mocked(findExistingCustomerOnSignup).mockResolvedValueOnce(null);
    mocked(storeCustomerDetails).mockResolvedValueOnce(data);

    const response = await createCustomer(data);

    expect(storeCustomerDetails).toHaveBeenCalled();
    expect(response.success).toBe(true);
    expect(response.code).toBe(201);
    expect(response.message).toBe('Customer created successfully');
    expect(response.data).toEqual(data);
  });
});
