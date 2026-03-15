import { z } from 'zod';
import { ROLES } from '../../utils/constant';

const RegisterDataSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.email(),
  password: z.string().min(6).max(100),
  phone: z.string(),
  role: z.enum(ROLES),
});

type RegisterDataSchemaType = z.infer<typeof RegisterDataSchema>;

export { RegisterDataSchema, RegisterDataSchemaType };
