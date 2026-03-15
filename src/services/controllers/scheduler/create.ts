import { Request, Response } from 'express';
import { schedulersArraySchema } from '../../dto/scheduler.dto';
import schedulerService from '../../services/scheduler.service';

async function createScheduler(req: Request, res: Response) {
  const { serviceId } = req.params;

  const validationBodyResult = schedulersArraySchema.safeParse(req.body['schedulers']);
  if (!validationBodyResult.success) {
    return res
      .status(400)
      .json({ message: 'Invalid request body', errors: validationBodyResult.error });
  }

  try {
    const schedulers = validationBodyResult.data.map((scheduler) => ({
      startTime: new Date(scheduler.startTime),
      endTime: new Date(scheduler.endTime),
    }));

    await schedulerService.create(serviceId as string, schedulers);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default createScheduler;
