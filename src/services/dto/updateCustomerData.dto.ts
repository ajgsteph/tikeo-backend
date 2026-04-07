import '../../config/openapi/zod-extend';
import { z } from 'zod';

const UpdateCustomerDataSchema = z
  .object({
    firstname: z
      .string()
      .min(3, 'le prenoms doit contenir au moins 3 caractères')
      .max(100, 'Le prénom doit contenir au maximum 100 caractères')
      .optional(),
    lastname: z
      .string()
      .min(3, 'Le nom de famille doit contenir au moins 3 caractères')
      .max(100, 'Le nom de famille doit contenir au maximum 100 caractères')
      .optional(),
    phoneNumber: z
      .string()
      .min(8, 'Le numéro de téléphone doit contenir au moins 8 caractères')
      .max(100, 'Le numéro de téléphone doit contenir au maximum 100 caractères')
      .optional(),
  })
  .openapi('UpdateCustomerData', {
    description: 'Données de mise à jour d\'un client (tous les champs sont optionnels)',
    example: { phoneNumber: '+22890999999' },
  });

export { UpdateCustomerDataSchema };
