import { faker } from '@faker-js/faker';

export const generateCustomerRequest = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phoneNo: faker.phone.phoneNumber('23481########'),
  isEmployee: faker.datatype.boolean(),
  isAffiliate: faker.datatype.boolean(),
});
