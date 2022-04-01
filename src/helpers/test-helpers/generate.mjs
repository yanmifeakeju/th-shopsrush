import { faker } from '@faker-js/faker';

export const generateCustomerRequest = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  isEmployee: faker.datatype.boolean(),
});
