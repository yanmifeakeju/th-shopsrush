// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export const development = {
  client: 'postgresql',
  connection: {
    database: 'shoprus',
    user: 'yanmifeakeju',
    password: 'yanmife',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
    loadExtensions: ['.mjs'],
  },
  seeds: {
    directory: './seeds',
  },
};

export const production = {
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user: 'username',
    password: 'password',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
    loadExtensions: ['.mjs'],
  },
  seeds: {
    directory: './seeds',
  },
};

export default { development, production };
