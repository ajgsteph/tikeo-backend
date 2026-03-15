import { Request, Response } from 'express';
import { UpdateProviderDataSchema } from '../dto/updateProviderData.dto';
import providersService from '../services/providers.service';
import { logger } from '../../shared/logger/logger.service';

async function update(req: Request, res: Response) {
  const userId = (req.user as { id: string }).id;

  const validationBodyResult = UpdateProviderDataSchema.safeParse(req.body);

  try {
    if (!validationBodyResult.success) {
      return res.status(400).json({ message: validationBodyResult.error });
    }
    const jsonHasKey = Object.keys(validationBodyResult.data).length > 0;

    if (!jsonHasKey) {
      return res.status(400).json({ message: 'No data provided for update' });
    }
    const { businessName, description, address, linkCode, website } = validationBodyResult.data;

    await providersService.updateProvider(
      userId,
      businessName,
      description,
      address,
      linkCode,
      website,
    );
    return res.status(200).json({
      message: 'Provider updated successfully',
    });
  } catch (error) {
    logger.error('Error updating provider', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default update;
