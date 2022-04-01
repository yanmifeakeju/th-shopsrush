import logger from '../../../utils/logger';
import { createCustomer, findAllCustomers, findCustomer } from '../controllers/create-customer';

export const createNewCustomer = async (req, res) => {
  try {
    const response = await createCustomer(req.body);
    return res.status(response.code).json({
      success: response.success,
      message: response.message,
      error: response.error,
      data: response.data || undefined,
    });
  } catch (error) {
    logger.error('Error creating a new customer', error);
    return res.status(500).json({ success: false, message: 'Error creating a new customer' });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const response = await findAllCustomers(req.query);
    return res.status(response.code).json({
      success: response.success,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error) {
    logger.error('Error getting customers', error);
    return res.status(500).json({ success: false, message: 'Error getting customers' });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const response = await findCustomer(req.params.id);
    return res.status(response.code).json({
      success: response.success,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error) {
    logger.error('Error getting customer', error);
    return res.status(500).json({ success: false, message: 'Error getting customer' });
  }
};
