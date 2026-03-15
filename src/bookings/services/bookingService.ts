import prisma from '../../config/prisma/client';

class BookingService {
  createBooking(serviceId: string, scheduleId: string) {
    return prisma.booking.create({
      data: {
        serviceId,
        scheduleId,
      },
    });
  }
}

const bookingService = new BookingService();

export default bookingService;
