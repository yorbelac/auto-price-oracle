import { Schema, model, Document, Types } from 'mongoose';

// Interface for the car document
interface ICarDocument extends Document {
  _id: Types.ObjectId;
  make: string;
  modelName: string;  // renamed from 'model' to avoid conflict
  year: number;
  price: number;
  mileage: number;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the car model input (without document properties)
export interface ICarInput {
  make: string;
  modelName: string;  // renamed from 'model' to avoid conflict
  year: number;
  price: number;
  mileage: number;
  url?: string;
}

const carSchema = new Schema<ICarDocument>(
  {
    make: { type: String, required: true },
    modelName: { type: String, required: true },  // renamed from 'model' to avoid conflict
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    url: { type: String, required: false }
  },
  { timestamps: true }
);

// Compound index for URL uniqueness per user when URL is provided
carSchema.index({ url: 1, user: 1 }, { 
  unique: true,
  partialFilterExpression: { url: { $exists: true } } // Only apply uniqueness when URL exists
});

export const Car = model<ICarDocument>('Car', carSchema);
export type { ICarDocument }; 