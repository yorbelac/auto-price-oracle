import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  make: String,
  model: String,
  year: Number,
  mileage: Number,
  location: String,
  description: String,
  images: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Listing', listingSchema); 