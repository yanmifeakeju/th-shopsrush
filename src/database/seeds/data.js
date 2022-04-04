/* eslint-disable camelcase */
import { faker } from '@faker-js/faker';
import randomstring from 'randomstring';
import { generateArrayofItems, generateCustomerRequest } from '../../utils/test-utils/generate';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('invoice_items').del();
  await knex('invoices').del();
  await knex('customers').del();
  await knex('discounts').del();

  // Inserts seed entries
  let customers = [];
  let discounts = [];
  let invoices = [];
  let invoiceItems = [];

  for (let i = 0; i < 10; i += 1) {
    const {
      firstName: first_name,
      lastName: last_name,
      email,
      phoneNo: phone_no,
      isEmployee: is_employee,
      isAffiliate: is_affiliate,
    } = generateCustomerRequest();

    customers.push(knex('customers').insert({ first_name, last_name, email, phone_no, is_employee, is_affiliate }).returning('*'));
  }
  customers = (await Promise.all(customers)).flat();

  const discountData = {
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

  Object.keys(discountData).forEach((key) => {
    discounts.push(knex('discounts').insert(discountData[key]).returning('*'));
  });

  discounts = (await Promise.all(discounts)).flat();
  const numberofTestInvoices = 200;

  for (let i = 0; i < numberofTestInvoices; i += 1) {
    invoices.push(
      knex('invoices')
        .insert({
          bill_no: randomstring.generate({ length: 10, charset: 'alphanumeric' }),
          customer_id: faker.random.arrayElement(customers).id,
          discount_id: i % 2 === 0 ? faker.random.arrayElement(discounts).id : null,
        })
        .returning('*')
    );
  }

  invoices = (await Promise.all(invoices)).flat();

  for (let i = 0; i < numberofTestInvoices; i += 1) {
    const invoiceItemsData = generateArrayofItems(20);
    const invoiceItemsWithInvoiceId = invoiceItemsData.map((item) => ({ ...item, invoice_id: invoices[i].id }));
    invoiceItems.push(knex('invoice_items').insert(invoiceItemsWithInvoiceId).returning('*'));
  }

  invoiceItems = (await Promise.all(invoiceItems)).flat();
}
