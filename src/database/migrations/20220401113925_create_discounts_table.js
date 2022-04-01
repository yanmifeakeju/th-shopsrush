/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableName = 'discounts';

export const up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').unique().primary().notNullable();
    table.string('description').notNullable();
    table.decimal('rate', 2).notNullable();
    table.string('name').notNullable().unique();
    table.string('discount_level').notNullable().unique();
    table.timestamps(true, true);
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
