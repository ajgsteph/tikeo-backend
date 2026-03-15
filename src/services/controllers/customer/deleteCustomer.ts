import { Request, Response } from 'express';
import { getServiceFromRequest } from '../../utiles/getServiceFromRequest';
import customerService from '../../services/customer.service';

async function deleteCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const serviceData = await getServiceFromRequest(req, res);
    if (!serviceData) return;
    const { service, service_id } = serviceData;
    await customerService.deleteCustomer(id, service_id);
    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error deleting customer',
    });
  }
}

export default deleteCustomer;
