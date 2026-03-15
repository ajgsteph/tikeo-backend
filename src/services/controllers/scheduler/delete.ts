import { Request, Response } from 'express';
import schedulerService from '../../services/scheduler.service';
import { Prisma } from '@prisma/client';

async function deleteSchedule(req: Request, res: Response) {
  try {
    const scheduleId = req.params.scheduleId as string;

    if (!scheduleId) {
      return res.status(400).json({ message: 'Schedule ID is required' });
    }

    await schedulerService.remove(scheduleId);

    return res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Schedule not found or already booked' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default deleteSchedule;
