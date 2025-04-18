import { Request, Response } from 'express';
import { Car, ICarDocument, ICarInput } from '../models/Car';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Create a new car
export const createCar = async (req: Request<{}, {}, ICarInput>, res: Response) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create car' });
  }
};

// Get all cars
export const getCars = async (_req: Request, res: Response) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

// Get a single car
export const getCar = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

// Update a car
export const updateCar = async (req: Request<{ id: string }, {}, Partial<ICarInput>>, res: Response) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update car' });
  }
};

// Delete a car
export const deleteCar = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete car' });
  }
}; 