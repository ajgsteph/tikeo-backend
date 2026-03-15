import { z } from 'zod';
import decimalSchema from '../../utils/decimalSchema';
import { schedulerSchema } from './scheduler.dto';

const UpdateSchedulerSchema = schedulerSchema.extend({
  id: z.uuid(),
});

const UpdateServiceSchema = z.object({
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
    .optional(),
  duration: z.number().int().positive('Duration must be a positive integer').optional(),
  options: z
    .array(
      z.object({
        id: z.uuid(),
        name: z
          .string()
          .min(1, 'Option name is required')
          .max(50, 'Option name must be less than 50 characters'),
        price: decimalSchema.refine((val) => val.greaterThan(0), {
          message: 'Price must be a positive decimal number',
        }),
      }),
    )
    .optional(),
  schedulers: z.array(UpdateSchedulerSchema).optional(),
});

export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;

export { UpdateServiceSchema, UpdateSchedulerSchema };
