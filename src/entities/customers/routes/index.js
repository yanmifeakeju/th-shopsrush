import { Router } from 'express';
import { createNewCustomer, getCustomer, getCustomers } from './customers';

const router = Router();

router.post('/', createNewCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomer);

export default router;
