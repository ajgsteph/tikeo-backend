import { Request, Response } from 'express';
import servicesService from '../../services/services.service';
import { me } from '../../../user/controllers/user.controller';

async function getProviderService(req: Request, res: Response) {
  try {
    const userId = (req.user as { id: string }).id;
    const service = await servicesService.getServiceByUserId(userId);

    return res.status(200).json({ service, message: 'Service retrieved successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default getProviderService;
