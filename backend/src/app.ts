import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // Allow your frontend origin
  credentials: true,
}));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app; 