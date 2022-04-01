import knex from 'knex';
import stringCase from 'knex-stringcase';
import config from './knexfile';

const options = stringCase(config[process.env.NODE_ENV]);
const db = knex(options);

export default db;
