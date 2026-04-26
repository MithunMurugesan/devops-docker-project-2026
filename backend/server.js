const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/booking_db';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
})
.then(async () => {
  console.log('MongoDB Connected');
  await seedData();
})
.catch(err => console.error('MongoDB Connection Error:', err));

// Models
const ListingSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  image: String,
  description: String,
});

const BookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  customerName: String,
  date: String,
});

const Listing = mongoose.model('Listing', ListingSchema);
const Booking = mongoose.model('Booking', BookingSchema);

// Initial Data Seed (if empty)
const seedData = async () => {
  const count = await Listing.countDocuments();
  if (count === 0) {
    const listings = [
      {
        title: 'Luxury Villa with Ocean View',
        location: 'Bali, Indonesia',
        price: 250,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        description: 'A beautiful villa overlooking the Indian Ocean.'
      },
      {
        title: 'Modern Apartment in Paris',
        location: 'Paris, France',
        price: 180,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
        description: 'Experience the romantic city from a stylish apartment.'
      },
      {
        title: 'Cozy Cabin in the Woods',
        location: 'Aspen, Colorado',
        price: 150,
        image: 'https://images.unsplash.com/photo-1449156001437-3a1621cdcd2e?auto=format&fit=crop&q=80&w=800',
        description: 'Perfect getaway for nature lovers.'
      }
    ];
    await Listing.insertMany(listings);
    console.log('Database seeded');
  }
};

// Routes
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { listingId, customerName, date } = req.body;
    const newBooking = new Booking({ listingId, customerName, date });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
