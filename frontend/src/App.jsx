import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Search, X, Calendar, ClipboardList, ArrowRight, LogIn, UserPlus } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';
const CONVERSION_RATE = 83;

const MOCK_LISTINGS = [
  { _id: '1', title: 'Santorini Cliffside Villa', location: 'Santorini, Greece', description: 'Breathtaking views of the Aegean Sea from a luxurious cliffside retreat with a private infinity pool.', price: 420, image: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=600&q=80' },
  { _id: '2', title: 'Bali Jungle Eco-Lodge', location: 'Ubud, Bali', description: 'A serene escape surrounded by terraced rice fields and tropical greenery, steps from local temples.', price: 185, image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80' },
  { _id: '3', title: 'Tokyo Skyline Penthouse', location: 'Shibuya, Tokyo', description: 'Ultra-modern penthouse with panoramic city views, a rooftop terrace, and smart-home technology.', price: 560, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { _id: '4', title: 'Swiss Alpine Chalet', location: 'Zermatt, Switzerland', description: 'Cozy wooden chalet with direct Matterhorn views, a hot tub, and ski-in/ski-out access.', price: 680, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { _id: '5', title: 'Maldives Overwater Bungalow', location: 'North Malé Atoll, Maldives', description: 'Glass-floor bungalow perched above crystal-clear lagoon waters with direct ocean access.', price: 890, image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80' },
  { _id: '6', title: 'Amalfi Coast Terrace Suite', location: 'Positano, Italy', description: 'Romantic suite with a sun-drenched terrace overlooking the dramatic Italian coastline.', price: 370, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80' },
];

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount);
};

// --- Shared Navbar ---
const Navbar = ({ user }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) return null;

  return (
    <nav>
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>StaySphere</Link>
      <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/explore" style={{ textDecoration: 'none', color: location.pathname === '/explore' ? 'var(--primary)' : 'inherit', fontWeight: 600 }}>Explore</Link>
        <Link to="/bookings" style={{ textDecoration: 'none', color: location.pathname === '/bookings' ? 'var(--primary)' : 'inherit', fontWeight: 600 }}>My Bookings</Link>
        {user ? (
          <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'white' }}>{user.name[0]}</div>
        ) : (
          <Link to="/login" className="btn" style={{ textDecoration: 'none', padding: '0.5rem 1.25rem' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

// --- Home Page ---
const Home = () => {
  return (
    <div className="home-hero">
      <h1 className="animate-up">Journey Beyond<br/>The Ordinary</h1>
      <p className="animate-up delay-1">Discover handcrafted stays and unique adventures across the globe. Your next chapter starts here.</p>
      <div className="cta-group animate-up delay-2">
        <Link to="/explore" className="btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Start Exploring <ArrowRight size={18} />
        </Link>
        <Link to="/signup" className="btn-secondary" style={{ textDecoration: 'none' }}>Join Community</Link>
      </div>
    </div>
  );
};

// --- Auth Components ---
const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: 'Guest User', email: formData.email });
    navigate('/explore');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to manage your bookings</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Login</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup"><span>Sign Up</span></Link>
        </div>
      </div>
    </div>
  );
};

const Signup = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: formData.name, email: formData.email });
    navigate('/explore');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join StaySphere today</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Create Account</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login"><span>Login</span></Link>
        </div>
      </div>
    </div>
  );
};

// --- Main App with Routing ---
function App() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [bookingData, setBookingData] = useState({ customerName: '', date: '', days: 1 });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/listings`);
      setListings(res.data && res.data.length > 0 ? res.data : MOCK_LISTINGS);
    } catch (err) { setListings(MOCK_LISTINGS); }
    finally { setLoading(false); }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const newBooking = {
      id: Date.now(), listingTitle: selectedListing.title,
      total: selectedListing.price * CONVERSION_RATE * bookingData.days,
      ...bookingData, status: 'Confirmed'
    };
    setBookings([newBooking, ...bookings]);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowModal(false);
      setBookingData({ customerName: '', date: '', days: 1 });
    }, 2000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup onLogin={setUser} />} />
          
          <Route path="/explore" element={
            <div className="container">
              <header className="hero">
                <h1>Find your next adventure</h1>
                <p>Book unique stays in over 190 countries.</p>
              </header>
              <div className="grid">
                {listings.map(listing => (
                  <div key={listing._id} className="card">
                    <img src={listing.image} alt={listing.title} className="card-image" />
                    <div className="card-content">
                      <h3 className="card-title">{listing.title}</h3>
                      <div className="card-location"><MapPin size={16} /> {listing.location}</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{listing.description}</p>
                      <div className="card-footer">
                        <div className="price">{formatINR(listing.price * CONVERSION_RATE)}<span> / night</span></div>
                        <button className="btn" onClick={() => { setSelectedListing(listing); setShowModal(true); }}>Book Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} />

          <Route path="/bookings" element={
            <div className="container">
              <header className="hero" style={{ padding: '2rem 0' }}>
                <h1>My Bookings</h1>
                <p>View and manage your upcoming stays.</p>
              </header>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card-bg)', borderRadius: '2rem' }}>
                  <ClipboardList size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h3>No bookings yet</h3>
                  <Link to="/explore" className="btn" style={{ marginTop: '1.5rem', textDecoration: 'none', display: 'inline-block' }}>Explore Now</Link>
                </div>
              ) : (
                <div className="grid">
                  {bookings.map(booking => (
                    <div key={booking.id} className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 className="card-title">{booking.listingTitle}</h3>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>{booking.status}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {booking.date} ({booking.days} {booking.days === 1 ? 'day' : 'days'})</div>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Total Amount</span>
                          <span style={{ color: 'var(--text)', fontWeight: 700 }}>{formatINR(booking.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )} />
        </Routes>

        {showModal && selectedListing && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2>Complete Booking</h2>
                <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
              </div>
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem' }}>🎉</div>
                  <h3 style={{ color: 'var(--primary)' }}>Confirmed!</h3>
                </div>
              ) : (
                <form onSubmit={handleBooking}>
                  <div className="input-group"><label>Property</label><input type="text" value={selectedListing.title} disabled /></div>
                  <div className="input-group"><label>Your Name</label><input type="text" required value={bookingData.customerName} onChange={e => setBookingData({...bookingData, customerName: e.target.value})} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group"><label>Check-in Date</label><input type="date" required value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} /></div>
                    <div className="input-group"><label>No. of Days</label><input type="number" min="1" required value={bookingData.days} onChange={e => setBookingData({...bookingData, days: parseInt(e.target.value)})} /></div>
                  </div>
                  <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Confirm — {formatINR(selectedListing.price * CONVERSION_RATE * bookingData.days)}</button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
