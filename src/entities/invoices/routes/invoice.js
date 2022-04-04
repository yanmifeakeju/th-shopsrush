import logger from '../../../utils/logger';
import { createInvoice } from '../controllers';

export const createNewInvoice = async (req, res) => {
  try {
    const response = await createInvoice({ ...req.params, ...req.body });

    return res.status(response.code).json({
      success: response.success,
      message: response.message,
      error: response.error,
      data: response.data,
    });
  } catch (error) {
    logger.error('Error creating a new invoice', error);
    return res.status(500).json({ success: false, message: 'Error creating a new invoice' });
  }
};
