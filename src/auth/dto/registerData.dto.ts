import '../../config/openapi/zod-extend';
import { z } from 'zod';
import { ROLES } from '../../utils/constant';

const RegisterDataSchema = z
  .object({
    name: z.string().min(2).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    phone: z.string(),
    role: z.enum(ROLES),
  })
  .openapi('RegisterData', {
    description: "Données d'inscription d'un nouvel utilisateur",
    example: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      password: 'secret123',
      phone: '+22890000000',
      role: 'PROVIDER',
    },
  });

type RegisterDataSchemaType = z.infer<typeof RegisterDataSchema>;

export { RegisterDataSchema, RegisterDataSchemaType };
