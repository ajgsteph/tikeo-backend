import { Router } from 'express';
import createBooking from '../controllers/createBooking';

const bookingRouter = Router();

bookingRouter.post('/service/:serviceId', createBooking);

export default bookingRouter;
