import { Request, Response } from 'express';
import bookingService from '../services/bookingService';
import { getServiceFromRequest } from '../../services/utiles/getServiceFromRequest';

async function deleteBooking(req: Request, res: Response) {
  const serviceData = await getServiceFromRequest(req, res);
  if (!serviceData) return;

  const { id } = req.params;

  try {
    await bookingService.deleteBooking(id, serviceData.service_id);

    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'BOOKING_NOT_FOUND') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default deleteBooking;
