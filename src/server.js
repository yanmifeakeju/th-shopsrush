import express from 'express';
import logger from './utils/logger';

import customerRouter from './entities/customers/routes';
import discountRouter from './entities/discounts/routes';
import invoiceRouter from './entities/invoices/routes';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());

app.use('/customers', customerRouter);
app.use('/discounts', discountRouter);
app.use('/invoices', invoiceRouter);
app.get('/', (_request, response) => response.status(200).send({ hello: 'You are on ShopsRUs API' }));

const server = app.listen(app.get('port'), () => logger.info(`Server listening on port ${server.address().port}`));
