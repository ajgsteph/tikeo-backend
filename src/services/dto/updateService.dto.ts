import '../../config/openapi/zod-extend';
import { z } from 'zod';
import decimalSchema from '../../utils/decimalSchema';
import { schedulerBaseSchema } from './scheduler.dto';

const UpdateSchedulerSchema = schedulerBaseSchema
  .extend({
    id: z.string().uuid(),
  })
  .openapi('UpdateScheduler', {
    description: 'Créneau horaire existant à mettre à jour (avec id)',
  });

const UpdateServiceSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Service name is required')
      .max(100, 'Service name must be less than 100 characters')
      .optional(),
    description: z.string().min(3).optional(),
    price: decimalSchema
      .refine((val) => val.greaterThan(0), {
        message: 'Price must be a positive decimal number',
      })
      .openapi({ type: 'number', example: 5000 })
      .optional(),
    duration: z.number().int().positive('Duration must be a positive integer').optional(),
    options: z
      .array(
        z.object({
          id: z.string().uuid(),
          name: z
            .string()
            .min(1, 'Option name is required')
            .max(50, 'Option name must be less than 50 characters'),
          price: decimalSchema
            .refine((val) => val.greaterThan(0), {
              message: 'Price must be a positive decimal number',
            })
            .openapi({ type: 'number', example: 2000 }),
        }),
      )
      .optional(),
    schedulers: z.array(UpdateSchedulerSchema).optional(),
  })
  .openapi('UpdateService', {
    description: 'Données de mise à jour d\'un service (tous les champs sont optionnels)',
  });

export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;

export { UpdateServiceSchema, UpdateSchedulerSchema };
