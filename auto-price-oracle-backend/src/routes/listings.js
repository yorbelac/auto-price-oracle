import express from 'express';
import Listing from '../models/Listing.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new listing
router.post('/', auth, async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      postedBy: req.user._id
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ isActive: true })
      .sort({ lastSeen: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a listing
router.patch('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      { ...req.body, lastSeen: new Date() },
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user._id
    });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 