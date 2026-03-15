import { Request, Response } from 'express';
import { User } from '../../user/type';
import servicesService from '../services/services.service';

export async function getServiceFromRequest(req: Request, res: Response) {
  const userId = (req.user as User).id;

  if (userId === undefined) {
    res.status(400).json({
      success: false,
      message: 'Le user ID est manquant',
    });
    return null;
  }

  const service = await servicesService.getServiceByUserId(userId);
  const serviceId = service?.id;

  if (serviceId === undefined) {
    res.status(400).json({
      success: false,
      message: 'Le service ID est manquant',
    });
    return null;
  }

  return { service, service_id: serviceId };
}
