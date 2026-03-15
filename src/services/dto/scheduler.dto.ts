import { z } from 'zod';

const schedulerSchema = z
  .object({
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'endTime must be after startTime',
  });

const schedulersArraySchema = z.array(schedulerSchema);

export { schedulerSchema, schedulersArraySchema };
