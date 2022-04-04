# SHOPSRUS

API Desgined to provide the capacity for an existing retail outlet to calculate discount, generate total costs, generate the invoices for customers. Features include:

- Create customer
- Retrieve a list of registered customers
- Retrieve a specific customr by ID
- Retrieve customers with a specific name
- Calculate total invoice amount given a bill
- Retrieve list of all discounts
- Retrieve a specific discount percentage by type
- Add a new discount type

Follow the entry file `src/server.js` to see the list of routes for above opration

## Set Up and Commands

- Copy the .env.example a new file and name .env and update its value accordingly.
- Run `yarn` to downloand dependencies and `yarn migrate:up` to sync the database.
- you should run `yarn seed` to seed database with some data.
- Run `yarn test` to run the tests
- Run `yarn build` to compile the files
- Run `yarn start:dev` to start the server in dev mode
- Run `yarn start` to start the server in prod mode
