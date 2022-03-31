import express from 'express';

const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (_request, response) => response.status(200).send({ hello: 'You are on ShopsRUs API' }));

export default app;
