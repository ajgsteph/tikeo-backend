import { Request, Response } from 'express';
import { CreateBookingSchema } from '../dto/createBooking.dto';
import bookingService from '../services/bookingService';

async function createBooking(req: Request, res: Response) {
  const { serviceId } = req.params;

  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' });
  }

  const validationResult = CreateBookingSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: 'Invalid request body', errors: validationResult.error });
  }

  const { scheduleId, firstname, lastname, phoneNumber } = validationResult.data;

  try {
    const booking = await bookingService.createBooking(serviceId, scheduleId, {
      firstname,
      lastname,
      phoneNumber,
    });

    return res.status(201).json({ message: 'Booking created successfully', data: booking });
  } catch (error) {
    if (error instanceof Error && error.message === 'SCHEDULE_UNAVAILABLE') {
      return res.status(409).json({ message: 'Schedule is not available or already booked' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default createBooking;
