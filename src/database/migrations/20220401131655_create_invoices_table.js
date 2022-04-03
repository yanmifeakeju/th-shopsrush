/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableName = 'invoices';

export const up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').unique().primary().notNullable();
    table.integer('customer_id').notNullable();
    table.integer('discount_id');
    table.decimal('gross', 12, 4).notNullable();
    table.decimal('discount', 12, 4).defaultTo(0);
    table.enum('status', ['pending', 'paid']).notNullable().defaultTo('pending');
    table.timestamps(true, true);

    table.foreign('customer_id').references('customers.id');
    table.foreign('discount_id').references('discounts.id');
  });

  await knex.raw(`CREATE TRIGGER update_timestamp BEFORE UPDATE ON ${tableName} FOR EACH ROW EXECUTE PROCEDURE update_timestamp();`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable(tableName);
};
