import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middlewares/error.middleware';
import routes from './app/routes';

const app: Application = express();

// Middlewares
app.use(cors());
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
