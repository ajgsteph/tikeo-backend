import '../../config/openapi/zod-extend';
import { z } from 'zod';
import decimalSchema from '../../utils/decimalSchema';
import { schedulerSchema } from './scheduler.dto';

const CreateServiceSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Service name is required')
      .max(100, 'Service name must be less than 100 characters'),
    description: z.string().min(3).optional(),
    price: decimalSchema
      .refine((val) => val.greaterThan(0), {
        message: 'Price must be a positive decimal number',
      })
      .openapi({ type: 'number', example: 5000 }),
    duration: z.number().int().positive('Duration must be a positive integer'),
    options: z
      .array(
        z.object({
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
    schedulers: z.array(schedulerSchema),
  })
  .openapi('CreateService', {
    description: 'Données de création d\'un service avec options et créneaux horaires',
  });

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;

export { CreateServiceSchema };
