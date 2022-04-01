import express from 'express';
import logger from './utils/logger';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());

app.get('/', (_request, response) => response.status(200).send({ hello: 'You are on ShopsRUs API' }));

const server = app.listen(app.get('port'), () => logger.info(`Server listening on port ${server.address().port}`));
