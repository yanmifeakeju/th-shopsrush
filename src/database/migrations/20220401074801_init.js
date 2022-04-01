export const up = async (knex) => {
  await knex.raw(`
  CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER LANGUAGE plpgsql
  AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$;
  `);

  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
};

export const down = async () => {};
