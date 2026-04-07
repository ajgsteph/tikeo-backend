import '../../config/openapi/zod-extend';
import { z } from 'zod';

const UpdateProviderDataSchema = z
  .object({
    businessName: z
      .string()
      .min(3, 'Business name is required')
      .max(100, 'Business name must be less than 100 characters')
      .optional(),
    description: z.string().min(3).optional(),
    address: z.string().min(3).max(100, 'Address must be less than 100 characters').optional(),
    linkCode: z
      .string()
      .min(3, 'Link code is required')
      .max(50, 'Link code must be less than 50 characters')
      .optional(),
    website: z.string().min(3).max(100, 'Website must be less than 100 characters').optional(),
  })
  .strict()
  .openapi('UpdateProviderData', {
    description: 'Données de mise à jour du profil fournisseur (tous les champs sont optionnels)',
    example: {
      businessName: 'Salon Beauté Premium',
      address: '15 Rue de Lomé, Lomé',
    },
  });

export { UpdateProviderDataSchema };
