import logger from '../../../utils/logger';
import { createCustomer } from '../controllers/create-customer';

export const createNewCustomer = async (req, res) => {
  try {
    const response = await createCustomer(req.body);
    return res.status(response.code).json({
      success: response.success,
      message: response.message || undefined,
      error: response.error || undefined,
      data: response.data || undefined,
    });
  } catch (error) {
    console.log(error);
    logger.error('Error creating a new customer', error);
    return res.status(500).json({ success: false, message: 'Error creating a new customer' });
  }
};
