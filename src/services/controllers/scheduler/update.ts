import { Request, Response } from 'express';
import servicesService from '../../services/services.service';
import { UpdateSchedulerSchema } from '../../dto/updateService.dto';

async function updateScheduler(req: Request, res: Response) {
  const serviceId = req.params.serviceId;
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' });
  }

  const validationBodyResult = UpdateSchedulerSchema.safeParse(req.body);
  if (!validationBodyResult.success) {
    return res
      .status(400)
      .json({ message: 'Invalid request body', errors: validationBodyResult.error });
  }
  try {
    const updatedScheduler = await servicesService.updateService(serviceId as string, {
      schedulers: [validationBodyResult.data],
    });

    return res
      .status(200)
      .json({ service: updatedScheduler, message: 'Service Scheduler updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default updateScheduler;
