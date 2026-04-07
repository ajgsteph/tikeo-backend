import '../config/openapi/zod-extend';
import { Decimal } from '@prisma/client/runtime/client';
import { z } from 'zod';

// Reusable Decimal schema
const decimalSchema = z
  .preprocess((val) => {
    if (typeof val === 'string' || typeof val === 'number') {
      try {
        return new Decimal(val);
      } catch {
        return val;
      }
    }
    return val;
  }, z.instanceof(Decimal))
  .openapi('Decimal', { type: 'number', example: 5000 });

export default decimalSchema;
