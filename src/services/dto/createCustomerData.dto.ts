import '../../config/openapi/zod-extend';
import { z } from 'zod';

const CreateCustomerDataSchema = z
  .object({
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
  .openapi('CreateCustomerData', {
    description: 'Données de création d\'un client',
    example: { firstname: 'Kofi', lastname: 'Mensah', phoneNumber: '+22890123456' },
  });

export { CreateCustomerDataSchema };
