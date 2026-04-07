import '../../config/openapi/zod-extend';
import { z } from 'zod';

const LoginDataSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .openapi('LoginData', {
    description: 'Identifiants de connexion',
    example: { email: 'user@example.com', password: 'secret123' },
  });

export { LoginDataSchema };
