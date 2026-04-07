import { Request, Response } from 'express';
import bookingService from '../services/bookingService';
import { getServiceFromRequest } from '../../services/utiles/getServiceFromRequest';

export async function getAllBookings(req: Request, res: Response) {
  try {
    const serviceData = await getServiceFromRequest(req, res);
    if (!serviceData) return;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await bookingService.getBookingsByServiceId(serviceData.service_id, page, limit);

    return res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export async function getBookingById(req: Request, res: Response) {
  try {
    const serviceData = await getServiceFromRequest(req, res);
    if (!serviceData) return;

    const { id } = req.params;
    const booking = await bookingService.getBookingById(id, serviceData.service_id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
