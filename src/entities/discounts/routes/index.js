import { Router } from 'express';
import { createNewDiscount, getDiscount, getDiscounts } from './discount';

const router = Router();

router.post('/', createNewDiscount);
router.get('/', getDiscounts);
router.get('/:type', getDiscount);

export default router;
