import express from 'express';
import {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carController';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET all cars
router.get('/', getCars);

// GET a single car
router.get('/:id', getCar);

// POST a new car
router.post('/', createCar);

// UPDATE a car
router.put('/:id', updateCar);

// DELETE a car
router.delete('/:id', deleteCar);

export default router; 