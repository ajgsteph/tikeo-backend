import { Request, Response } from 'express';
import { User } from '../../user/type';
import providersService from '../services/providers.service';

export async function getProviderFromRequest(req: Request, res: Response) {
  const userId = (req.user as User).id;

  if (userId === undefined) {
    res.status(400).json({
      success: false,
      message: 'User ID is missing',
    });
    return null;
  }

  const provider = await providersService.getProviderByUserId(userId);
  const providerId = provider?.id;

  if (providerId === undefined) {
    res.status(400).json({
      success: false,
      message: 'Provider ID is missing',
    });
    return null;
  }

  return { provider, provider_id: providerId };
}
