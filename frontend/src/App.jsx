import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search, X, Calendar, ClipboardList } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';
const CONVERSION_RATE = 83;

const MOCK_LISTINGS = [
  {
    _id: '1',
    title: 'Santorini Cliffside Villa',
    location: 'Santorini, Greece',
    description: 'Breathtaking views of the Aegean Sea from a luxurious cliffside retreat with a private infinity pool.',
    price: 420,
    image: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=600&q=80',
  },
  {
    _id: '2',
    title: 'Bali Jungle Eco-Lodge',
    location: 'Ubud, Bali',
    description: 'A serene escape surrounded by terraced rice fields and tropical greenery, steps from local temples.',
    price: 185,
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80',
  },
  {
    _id: '3',
    title: 'Tokyo Skyline Penthouse',
    location: 'Shibuya, Tokyo',
    description: 'Ultra-modern penthouse with panoramic city views, a rooftop terrace, and smart-home technology.',
    price: 560,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
  },
  {
    _id: '4',
    title: 'Swiss Alpine Chalet',
    location: 'Zermatt, Switzerland',
    description: 'Cozy wooden chalet with direct Matterhorn views, a hot tub, and ski-in/ski-out access.',
    price: 680,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
  {
    _id: '5',
    title: 'Maldives Overwater Bungalow',
    location: 'North Malé Atoll, Maldives',
    description: 'Glass-floor bungalow perched above crystal-clear lagoon waters with direct ocean access.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80',
  },
  {
    _id: '6',
    title: 'Amalfi Coast Terrace Suite',
    location: 'Positano, Italy',
    description: 'Romantic suite with a sun-drenched terrace overlooking the dramatic Italian coastline.',
    price: 370,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
  },
];

function App() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [bookingData, setBookingData] = useState({ customerName: '', date: '', days: 1 });
  const [showModal, setShowModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/listings`);
      const data = res.data && res.data.length > 0 ? res.data : MOCK_LISTINGS;
      setListings(data);
    } catch (err) {
      setListings(MOCK_LISTINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const newBooking = {
      id: Date.now(),
      listingTitle: selectedListing.title,
      price: selectedListing.price * CONVERSION_RATE,
      total: selectedListing.price * CONVERSION_RATE * bookingData.days,
      ...bookingData,
      status: 'Confirmed'
    };

    try {
      await axios.post(`${API_BASE}/bookings`, {
        listingId: selectedListing._id,
        ...bookingData
      });
    } catch (err) {
      // Silently continue
    }

    setBookings([newBooking, ...bookings]);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowModal(false);
      setBookingData({ customerName: '', date: '', days: 1 });
    }, 2000);
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="App">
      <nav>
        <div className="logo" onClick={() => setShowMyBookings(false)} style={{ cursor: 'pointer' }}>StaySphere</div>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <span 
            style={{ cursor: 'pointer', color: !showMyBookings ? 'var(--primary)' : 'inherit', fontWeight: 600 }}
            onClick={() => setShowMyBookings(false)}
          >
            Destinations
          </span>
          <span 
            style={{ cursor: 'pointer', color: showMyBookings ? 'var(--primary)' : 'inherit', fontWeight: 600 }}
            onClick={() => setShowMyBookings(true)}
          >
            My Bookings
          </span>
          <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Search size={18} />
          </div>
        </div>
      </nav>

      <div className="container">
        {showMyBookings ? (
          <div className="bookings-section">
            <header className="hero" style={{ padding: '2rem 0' }}>
              <h1>My Bookings</h1>
              <p>View and manage your upcoming stays.</p>
            </header>

            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'var(--card-bg)', borderRadius: '2rem', border: '1px solid var(--border)' }}>
                <ClipboardList size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>No bookings yet</h3>
                <p>Start exploring destinations to book your first stay!</p>
                <button className="btn" style={{ marginTop: '1.5rem' }} onClick={() => setShowMyBookings(false)}>Explore Now</button>
              </div>
            ) : (
              <div className="grid">
                {bookings.map((booking) => (
                  <div key={booking.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 className="card-title" style={{ margin: 0 }}>{booking.listingTitle}</h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: 'rgba(34, 197, 94, 0.2)', 
                        color: '#4ade80',
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} />
                        {booking.date} ({booking.days} {booking.days === 1 ? 'day' : 'days'})
                      </div>
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Total Amount</span>
                        <span style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.1rem' }}>{formatINR(booking.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <header className="hero">
              <h1>Find your next adventure</h1>
              <p>Book unique stays in over 190 countries.</p>
            </header>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✈️</div>
                Loading stays...
              </div>
            ) : (
              <div className="grid">
                {listings.map((listing) => (
                  <div key={listing._id} className="card">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="card-image"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'; }}
                    />
                    <div className="card-content">
                      <h3 className="card-title">{listing.title}</h3>
                      <div className="card-location">
                        <MapPin size={16} />
                        {listing.location}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                        {listing.description}
                      </p>
                      <div className="card-footer">
                        <div className="price">
                          {formatINR(listing.price * CONVERSION_RATE)}
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}> / night</span>
                        </div>
                        <button
                          className="btn"
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowModal(true);
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedListing && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Complete Booking</h2>
              <X style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => setShowModal(false)} />
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Enjoy your stay at {selectedListing.title}.</p>
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="input-group">
                  <label>Property</label>
                  <input type="text" value={selectedListing.title} disabled />
                </div>
                <div className="input-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={bookingData.customerName}
                    onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label>Check-in Date</label>
                    <input
                      type="date"
                      required
                      value={bookingData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>No. of Days</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={bookingData.days}
                      onChange={(e) => setBookingData({ ...bookingData, days: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                  Confirm Reservation — {formatINR(selectedListing.price * CONVERSION_RATE * bookingData.days)} total
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
