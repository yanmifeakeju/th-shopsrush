import { generateCustomerRequest } from '../../../utils/test-utils/generate';
import { createCustomer } from './create-customer';

describe('Create Customer', () => {
  describe('Validation: Required Fields', () => {
    const requiredFields = ['firstName', 'lastName', 'email'];
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
});
