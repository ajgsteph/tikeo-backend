import { Request, Response } from 'express';
import { UpdateBookingStatusSchema } from '../dto/updateBookingStatus.dto';
import bookingService from '../services/bookingService';
import { getServiceFromRequest } from '../../services/utiles/getServiceFromRequest';

async function updateBookingStatus(req: Request, res: Response) {
  const serviceData = await getServiceFromRequest(req, res);
  if (!serviceData) return;

  const { id } = req.params;

  const validationResult = UpdateBookingStatusSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ message: 'Invalid request body', errors: validationResult.error });
  }

  try {
    const booking = await bookingService.updateBookingStatus(
      id,
      serviceData.service_id,
      validationResult.data.status,
    );

    return res.status(200).json({ message: 'Booking status updated successfully', data: booking });
  } catch (error) {
    if (error instanceof Error && error.message === 'BOOKING_NOT_FOUND') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default updateBookingStatus;
