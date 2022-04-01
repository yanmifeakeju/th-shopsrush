/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableName = 'invoice_items';

export const up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').unique().primary().notNullable();
    table.integer('invoice_id').notNullable();
    table.string('item').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('price', 2).notNullable();
    table.enum('categories', ['groceries', 'electronics', 'furniture']).notNullable();
    table.timestamps(true, true);

    table.foreign('invoice_id').references('invoices.id');
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
