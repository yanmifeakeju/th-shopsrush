import express from 'express';
import customerRouter from './entities/customers/routes/index.mjs';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());

app.use('/customers', customerRouter);

app.get('/', (_request, response) => response.status(200).send({ hello: 'You are on ShopsRUs API' }));

export default app;
