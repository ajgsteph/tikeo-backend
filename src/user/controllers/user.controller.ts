import { Request, Response } from 'express';
import { User } from '../type';
import { logger } from '../../shared/logger/logger.service';

async function me(req: Request, res: Response) {
  try {
    const user = req.user as User;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      message: 'User information retrieved successfully',
    });
  } catch (error) {
    logger.error('Error fetching user', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export { me };
