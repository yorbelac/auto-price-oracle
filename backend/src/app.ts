import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

export default app; 