import { Request, Response } from 'express';

async function createBookingByOwner(req: Request, res: Response) {
  const serviceId = req.params.serviceId;
  if (!serviceId) {
    return res.status(400).json({ message: 'Service ID is required' });
  }
}

export default createBookingByOwner;
