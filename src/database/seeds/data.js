/* eslint-disable camelcase */
import { faker } from '@faker-js/faker';
import { generateCustomerRequest } from '../../utils/test-utils/generate';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('customers').del();
  await knex('discounts').del();

  // Inserts seed entries
  const results = [];
  const discountResults = [];

  for (let i = 0; i < 10; i += 1) {
    const {
      firstName: first_name,
      lastName: last_name,
      email,
      phoneNo: phone_no,
      isEmployee: is_employee,
      isAffiliate: is_affiliate,
    } = generateCustomerRequest();

    results.push(knex('customers').insert({ first_name, last_name, email, phone_no, is_employee, is_affiliate }));
  }
  await Promise.all(results);

  const discounts = {
    affiliate: {
      rate: 10 / 100,
      type: 'affiliate',
      name: 'Affiliate Discount 10%',
      description: faker.lorem.sentence(30),
    },
    employees: {
      rate: 30 / 100,
      type: 'employees',
      name: "Employee's Discount 30%",
      description: faker.lorem.sentence(30),
    },
    customers: {
      rate: 5 / 100,
      type: 'customer',
      name: 'customer Discount 5%',
      description: faker.lorem.sentence(30),
    },

    general: {
      rate: 5 / 100,
      type: 'general',
      name: 'General Discount 5%',
      description: faker.lorem.sentence(30),
    },
  };

  Object.keys(discounts).forEach((key) => {
    discountResults.push(knex('discounts').insert(discounts[key]));
  });

  await Promise.all(discountResults);
}
