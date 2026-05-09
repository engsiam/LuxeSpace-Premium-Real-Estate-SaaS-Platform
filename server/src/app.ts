import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middlewares/error.middleware';
import routes from './app/routes';
import env, { getClientUrl, getTrustedOrigins } from './config';

const app: Application = express();

app.set('trust proxy', 1);

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
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const origins = getCorsOrigins();
    console.log('[CORS] Request origin:', origin);
    
    if (!origin) {
      console.log('[CORS] No origin, allowing...');
      callback(null, true);
      return;
    }
    
    if (origins.includes(origin)) {
      console.log('[CORS] Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('[CORS] Origin NOT allowed:', origin, 'Expected:', origins);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'pragma', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
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
