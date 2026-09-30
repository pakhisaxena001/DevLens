import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import errorMiddleware from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import repositoryRoutes from './routes/repository.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import aiRoutes from './routes/ai.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import publicRoutes from './routes/public.routes.js';


const app = express();


// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/public', publicRoutes);

// Error handling middleware
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
