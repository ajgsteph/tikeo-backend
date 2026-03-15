import { z } from 'zod';

const CreateProviderDataSchema = z.object({
  businessName: z
    .string()
    .min(3, 'Business name is required')
    .max(100, 'Business name must be less than 100 characters'),
  description: z.string().min(3).optional(),
  website: z.string().min(3).max(100, 'Website must be less than 100 characters').optional(),
  address: z.string().min(3).max(100, 'Address must be less than 100 characters').optional(),
  linkCode: z
    .string()
    .min(3, 'Link code is required')
    .max(50, 'Link code must be less than 50 characters'),
  currency: z
    .string()
    .min(3, 'Currency code is required')
    .max(10, 'Currency code must be less than 10 characters'),
});

export { CreateProviderDataSchema };
