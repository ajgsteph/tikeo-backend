import prisma from '../../config/prisma/client';
import { BookingStatus } from '@prisma/client';

class BookingService {
  async createBooking(
    serviceId: string,
    scheduleId: string,
    customerData: { firstname: string; lastname: string; phoneNumber: string },
  ) {
    return prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.findFirst({
        where: { id: scheduleId, serviceId, isBooked: false },
      });

      if (!schedule) {
        throw new Error('SCHEDULE_UNAVAILABLE');
      }

      let customer = await tx.customer.findFirst({
        where: { phoneNumber: customerData.phoneNumber, serviceId },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            firstname: customerData.firstname,
            lastname: customerData.lastname,
            phoneNumber: customerData.phoneNumber,
            serviceId,
          },
        });
      }

      const booking = await tx.booking.create({
        data: {
          serviceId,
          scheduleId,
          customerId: customer.id,
        },
        include: { customer: true, schedule: true },
      });

      await tx.schedule.update({
        where: { id: scheduleId },
        data: { isBooked: true },
      });

      return booking;
    });
  }

  async getBookingsByServiceId(serviceId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { serviceId },
        include: { customer: true, schedule: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.count({ where: { serviceId } }),
    ]);

    return {
      bookings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getBookingById(id: string, serviceId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true, schedule: true },
    });

    if (!booking || booking.serviceId !== serviceId) {
      return null;
    }

    return booking;
  }

  async updateBookingStatus(id: string, serviceId: string, status: BookingStatus) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking || booking.serviceId !== serviceId) {
      throw new Error('BOOKING_NOT_FOUND');
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status },
        include: { customer: true, schedule: true },
      });

      if (status === 'CANCELLED') {
        await tx.schedule.update({
          where: { id: booking.scheduleId },
          data: { isBooked: false },
        });
      }

      return updated;
    });
  }

  async deleteBooking(id: string, serviceId: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking || booking.serviceId !== serviceId) {
      throw new Error('BOOKING_NOT_FOUND');
    }

    return prisma.$transaction(async (tx) => {
      await tx.booking.delete({ where: { id } });

      await tx.schedule.update({
        where: { id: booking.scheduleId },
        data: { isBooked: false },
      });
    });
  }
}

const bookingService = new BookingService();

export default bookingService;
