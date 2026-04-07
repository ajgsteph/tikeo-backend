import '../../config/openapi/zod-extend';
import { z } from 'zod';

const CreateBookingSchema = z
  .object({
    scheduleId: z.string().uuid(),
    firstname: z
      .string()
      .min(3, 'Le prénom doit contenir au moins 3 caractères')
      .max(100, 'Le prénom doit contenir au maximum 100 caractères'),
    lastname: z
      .string()
      .min(3, 'Le nom de famille doit contenir au moins 3 caractères')
      .max(100, 'Le nom de famille doit contenir au maximum 100 caractères'),
    phoneNumber: z
      .string()
      .min(8, 'Le numéro de téléphone doit contenir au moins 8 caractères')
      .max(100, 'Le numéro de téléphone doit contenir au maximum 100 caractères'),
  })
  .openapi('CreateBooking', {
    description: 'Données de création d\'une réservation par un client',
    example: {
      scheduleId: '550e8400-e29b-41d4-a716-446655440000',
      firstname: 'Ama',
      lastname: 'Koffi',
      phoneNumber: '+22890123456',
    },
  });

export type CreateBookingDto = z.infer<typeof CreateBookingSchema>;

export { CreateBookingSchema };
