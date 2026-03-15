import prisma from '../../config/prisma/client';
import { CreateSchedulerType } from '../types/scheduler';

class SchedulerService {
  async create(serviceId: string, schedulers: CreateSchedulerType[]) {
    return prisma.schedule.createMany({
      data: schedulers.map((scheduler) => ({
        serviceId,
        startTime: scheduler.startTime,
        endTime: scheduler.endTime,
      })),
    });
  }

  async remove(id: string) {
    return prisma.schedule.delete({
      where: { id, isBooked: false },
    });
  }
}

const schedulerService = new SchedulerService();

export default schedulerService;
