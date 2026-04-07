import '../../config/openapi/zod-extend';
import { z } from 'zod';

const schedulerBaseSchema = z
  .object({
    startTime: z.iso.datetime().openapi({ type: 'string', format: 'date-time' }),
    endTime: z.iso.datetime().openapi({ type: 'string', format: 'date-time' }),
  })
  .openapi('Scheduler', {
    description: 'Créneau horaire avec heure de début et de fin (ISO 8601)',
    example: {
      startTime: '2026-04-10T09:00:00Z',
      endTime: '2026-04-10T10:00:00Z',
    },
  });

const schedulerSchema = schedulerBaseSchema.refine(
  (data) => data.endTime > data.startTime,
  { message: 'endTime must be after startTime' },
);

const schedulersArraySchema = z.array(schedulerSchema);

export { schedulerBaseSchema, schedulerSchema, schedulersArraySchema };
