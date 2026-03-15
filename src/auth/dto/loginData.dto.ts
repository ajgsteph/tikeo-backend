import { z } from 'zod';

const LoginDataSchema = z.object({ email: z.string().email(), password: z.string() });

export { LoginDataSchema };
