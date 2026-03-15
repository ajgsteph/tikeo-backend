import { Request, Response } from 'express';
import customerService from '../../services/customer.service';
import { getServiceFromRequest } from '../../utiles/getServiceFromRequest';
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const serviceData = await getServiceFromRequest(req, res);
    if (!serviceData) return;
    const { service, service_id } = serviceData;

    if (service_id === undefined) {
      return res.status(400).json({
        success: false,
        message: 'service ID is missing',
      });
    }

    const customer = await customerService.getCustomerById(id, service_id);

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Customer non trouvé',
    });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const serviceData = await getServiceFromRequest(req, res);
    if (!serviceData) return;
    const { service, service_id } = serviceData;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await customerService.getAllCustomers(service_id, page, limit);

    res.status(200).json({
      success: true,
      data: result.customers,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erreur serveur',
    });
  }
};
