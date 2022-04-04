import logger from '../../../utils/logger';
import { createDiscount, getAllDiscounts, retrieveDiscount } from '../controllers';

export const createNewDiscount = async (req, res) => {
  try {
    const response = await createDiscount(req.body);
    return res.status(response.code).json({
      success: response.success,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error) {
    logger.error('Error creating a new discount', error);
    return res.status(500).json({ success: false, message: 'Error creating a new discount' });
  }
};

export const getDiscounts = async (req, res) => {
  try {
    const response = await getAllDiscounts();
    return res.status(response.code).json({
      success: response.success,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error) {
    logger.error('Error getting discounts', error);
    return res.status(500).json({ success: false, message: 'Error getting discounts' });
  }
};

export const getDiscount = async (req, res) => {
  try {
    const response = await retrieveDiscount(req.params.type);
    return res.status(response.code).json({
      success: response.success,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error) {
    logger.error('Error getting discount', error);
    return res.status(500).json({ success: false, message: 'Error getting discount' });
  }
};
