import 'dotenv/config';
import './config/openapi/zod-extend';
import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import authRouter from './auth/routes/auth.route';
import userRouter from './user/routes/user.route';
import providersRouter from './providers/routes/providers.route';
import initializePassport from './config/passport/initialize';
import isAProvider from './middlewares/isAProvider';
import currencyRouter from './currency/routes/currency.route';
import bookingRouter from './bookings/routes/booking.route';
import cors from 'cors';
import { logger } from './shared/logger/logger.service';
import { apiReference } from '@scalar/express-api-reference';
import './config/openapi/routes';
import { generateOpenAPIDocument } from './config/openapi/openapi';

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = '/api';


initializePassport(passport);

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://tikeo-backend-bg8m.onrender.com'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get('/', (_req, res) => {
  res.send('Hello TypeScript with Node.js!');
});

app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/user`, userRouter);
app.use(
  `${BASE_URL}/providers`,
  passport.authenticate('jwt', { session: false }),
  isAProvider,
  providersRouter,
);
app.use(`${BASE_URL}/bookings`, bookingRouter);
app.use(`${BASE_URL}/currencies`, currencyRouter);

// app.get(`${BASE_URL}
// `, (_req, res) => {
//   res.json(generateOpenAPIDocument());
// });


// ── Documentation API ──────────────────────────────────────────
const openApiDoc = generateOpenAPIDocument();

// JSON brut — utile pour Postman / Insomnia
app.get('/openapi.json', (_req, res) => res.json(openApiDoc));


// UI Scalar
app.use(
  '/docs',
  apiReference({
    content: openApiDoc,      
    pageTitle: 'Tikeo API',
   layout: "modern",
  theme: "kepler",     // alternate | default | moon | purple | solarized
  }),
);


app.listen(PORT, () => {
  logger.log(`Server running on http://localhost:${PORT}`);
});

export { app };
