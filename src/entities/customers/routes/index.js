import { Router } from 'express';
import { createNewCustomer } from './customers';

const router = Router();

router.post('/', createNewCustomer);

export default router;
