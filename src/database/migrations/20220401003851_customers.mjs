const tableName = 'customers';

export const up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').unique().primary().notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable();
    table.boolean('is_employee').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.raw(`CREATE TRIGGER update_timestamp BEFORE UPDATE ON ${tableName} FOR EACH ROW EXECUTE PROCEDURE update_timestamp();`);
};

export const down = async (knex) => {
  await knex.schema.dropTable(tableName);
};
