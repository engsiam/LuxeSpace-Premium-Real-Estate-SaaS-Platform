import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middlewares/error.middleware';
import routes from './app/routes';
import env, { getClientUrl, getTrustedOrigins } from './config';

const app: Application = express();

const getCorsOrigins = (): string[] => {
  try {
    const origins = getTrustedOrigins();
    return origins;
  } catch {
    if (env.NODE_ENV === 'development') {
      return ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];
    }
    throw new Error('TRUSTED_ORIGINS is required in production');
  }
};

const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'pragma'],
};

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'LuxeSpace API is running' });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
