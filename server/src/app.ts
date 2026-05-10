import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middlewares/error.middleware';
import routes from './app/routes';
import env, { getClientUrl, getTrustedOrigins } from './config';

const app: Application = express();

// Trust proxy so Express sees correct origin behind Vercel/Render load balancers
app.set('trust proxy', 1);

const getCorsOrigins = (): string[] => {
  try {
    const origins = getTrustedOrigins();
    return origins;
  } catch {
    // Fallback to localhost in development
    if (env.NODE_ENV === 'development') {
      return ['http://localhost:3000', 'http://localhost:3001'];
    }
    // In production, require TRUSTED_ORIGINS env var
    throw new Error('TRUSTED_ORIGINS is required in production');
  }
};

// CORS config for cross-origin auth between Vercel frontend and Render backend:
// - credentials: true is REQUIRED - enables cookie sharing across origins
// - origin must be in allowed list (dynamic via TRUSTED_ORIGINS)
// - exposedHeaders allows browser to read Set-Cookie headers
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const origins = getCorsOrigins();
    
    // Allow requests with no origin (mobile apps, Postman) OR from trusted origins
    if (!origin) {
      callback(null, true);
      return;
    }
    
    if (origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
};

// Middlewares - ORDER MATTERS:
// 1. cookie-parser must come before routes to parse cookies for session checks
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
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
