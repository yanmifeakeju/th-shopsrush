import knex from 'knex';
import config from './knexfile.mjs';

const db = knex(config[process.env.NODE_ENV]);

export default db;
