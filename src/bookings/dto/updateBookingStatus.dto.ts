import '../../config/openapi/zod-extend';
import { z } from 'zod';

const UpdateBookingStatusSchema = z
  .object({
    status: z.enum(['CONFIRMED', 'CANCELLED']),
  })
  .openapi('UpdateBookingStatus', {
    description: 'Mise à jour du statut d\'une réservation par le fournisseur',
    example: { status: 'CONFIRMED' },
  });

export type UpdateBookingStatusDto = z.infer<typeof UpdateBookingStatusSchema>;

export { UpdateBookingStatusSchema };
