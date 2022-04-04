import { Router } from 'express';
import { createNewInvoice, getInvoice } from './invoice';

const router = Router();

router.post('/:customerId', createNewInvoice);
router.get('/:billNo', getInvoice);
router.get('/', (request, response) => {
  response.status(200).send({ hello: 'You are on ShopsRUs API' });
});

export default router;
