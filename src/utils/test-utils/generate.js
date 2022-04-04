import { faker } from '@faker-js/faker';

export const generateCustomerRequest = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phoneNo: faker.phone.phoneNumber('23481########'),
  isEmployee: faker.datatype.boolean(),
  isAffiliate: faker.datatype.boolean(),
});

export const generateArrayofItems = (number = 5) => {
  const items = [];
  for (let i = 0; i < number; i += 1) {
    items.push({
      name: faker.commerce.productName(),
      quantity: faker.datatype.number({ min: 1, max: 10 }),
      price: faker.commerce.price(),
      category: faker.random.arrayElement(['groceries', 'electronics', 'furniture']),
    });
  }

  return items;
};

export const returnRandomItem = (items) => faker.random.arrayElement(items);
