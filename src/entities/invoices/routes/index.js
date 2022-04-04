import { Router } from 'express';
import { createNewInvoice } from './invoice';

const router = Router();

router.post('/:customerId', createNewInvoice);
router.get('/', (request, response) => {
  response.status(200).send({ hello: 'You are on ShopsRUs API' });
});

export default router;
