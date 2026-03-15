import { Request, Response } from 'express';
import { User } from '../../user/type';
import providersService from '../services/providers.service';
import { logger } from '../../shared/logger/logger.service';

async function me(req: Request, res: Response) {
  const userId = (req.user as User).id;

  try {
    const provider = await providersService.getProviderByUserId(userId!);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    return res.status(200).json({ message: 'Provider found', provider });
  } catch (error) {
    logger.error('Error fetching provider', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default me;
