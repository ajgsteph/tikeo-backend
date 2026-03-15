import { Request, Response } from 'express';
import { CreateProviderDataSchema } from '../dto/createProviderData.dto';
import providersService from '../services/providers.service';
import { User } from '../../user/type';
import { logger } from '../../shared/logger/logger.service';

async function create(req: Request, res: Response) {
  const validationBodyResult = CreateProviderDataSchema.safeParse(req.body);

  if (!validationBodyResult.success) {
    return res.status(400).json({ message: validationBodyResult.error });
  }

  try {
    const userId = (req.user as User).id;
    const { businessName, description, address, linkCode, website, currency } =
      validationBodyResult.data;

    await providersService.createProvider(
      businessName,
      linkCode,
      userId!,
      address,
      description,
      website,
      currency,
    );

    return res.status(201).json({
      message: 'Provider created successfully',
    });
  } catch (error) {
    logger.error('Error creating provider', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default create;
