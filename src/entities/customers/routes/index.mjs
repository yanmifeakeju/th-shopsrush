import { Router } from 'express';
import { createNewCustomer } from './customer..mjs';

const router = Router();

router.post('/', createNewCustomer);

export default router;
