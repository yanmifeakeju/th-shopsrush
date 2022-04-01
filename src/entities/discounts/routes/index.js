import { Router } from 'express';
import { createNewDiscount } from './discount';

const router = Router();

router.post('/', createNewDiscount);
router.get('/', (req, res) => res.status(200).send({ hello: 'You are on ShopsRUs API' }));

export default router;
