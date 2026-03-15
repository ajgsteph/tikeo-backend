import prisma from '../../config/prisma/client';
import { CreateServiceDto } from '../dto/createService.dto';
import { UpdateServiceDto } from '../dto/updateService.dto';

class ServicesService {
  async createService(providerId: string, data: CreateServiceDto) {
    return prisma.service.create({
      data: {
        ...data,
        providerId,
        options: {
          create: data.options,
        },
        schedulers: {
          create: data.schedulers,
        },
      },
    });
  }

  async updateService(id: string, data: Partial<UpdateServiceDto>) {
    return prisma.service.update({
      where: { id },
      data: {
        ...data,
        options: {
          update: data.options?.map((option) => ({
            data: option,
            where: { id: option.id },
          })),
        },
        schedulers: {
          update: data.schedulers?.map((scheduler) => ({
            data: scheduler,
            where: { id: scheduler.id, isBooked: false },
          })),
        },
      },
      include: { schedulers: true, options: true },
    });
  }

  async getServiceByUserId(userId: string) {
    return prisma.service.findFirst({
      where: {
        provider: {
          userId: userId,
        },
      },
      include: {
        options: true,
        schedulers: true,
      },
    });
  }
}

const servicesService = new ServicesService();

export default servicesService;
