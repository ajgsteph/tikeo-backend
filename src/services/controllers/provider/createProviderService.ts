import { Request, Response } from 'express';
import { CreateServiceSchema } from '../../dto/createService.dto';
import servicesService from '../../services/services.service';
import providersService from '../../../providers/services/providers.service';

async function createProviderService(req: Request, res: Response) {
  const validationBodyResult = CreateServiceSchema.safeParse(req.body);

  if (!validationBodyResult.success) {
    return res.status(400).json({ message: validationBodyResult.error });
  }

  try {
    const userId = (req.user as { id: string }).id;
    const provider = await providersService.getProviderByUserId(userId, true);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    if (provider.service) {
      return res.status(409).json({ message: 'Provider already has a service' });
    }

    const service = await servicesService.createService(provider.id, validationBodyResult.data);

    return res.status(201).json({ service, message: 'Service successfuly created' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default createProviderService;
