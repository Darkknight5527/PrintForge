import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CustomOrder from './pages/CustomOrder';
import TrackOrder from './pages/TrackOrder';
import Account from './pages/Account';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';

const isAdminRoute = (path) => path.startsWith('/admin');

function AppShell() {
  const [cart, setCart] = useState([]);
  const addToCart = (item) => setCart(prev => [...prev, item]);

  return (
    <Router>
      <AdminAwareLayout cart={cart} addToCart={addToCart} />
    </Router>
  );
}

function AdminAwareLayout({ cart, addToCart }) {
  const { useLocation } = require('react-router-dom');
  const location = useLocation();
  const onAdmin = isAdminRoute(location.pathname);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {!onAdmin && <Navbar cartCount={cart.length} />}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Customer routes */}
          <Route path="/"        element={<Home onAddToCart={addToCart} />} />
          <Route path="/catalog" element={<Catalog onAddToCart={addToCart} />} />
          <Route path="/custom"  element={<CustomOrder />} />
          <Route path="/track"   element={<TrackOrder />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart"    element={
            <div style={{ paddingTop: 88, padding: '88px 5% 60px', maxWidth: 700, margin: '0 auto' }}>
              <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 36, color: 'var(--text)', marginBottom: 32 }}>Cart ({cart.length})</h1>
              {cart.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>
              ) : (
                <div>
                  {cart.map((item, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{item.name}</div>
                        {item.material && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.material}</div>}
                      </div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{item.price}</div>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>Total</span>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 24, color: 'var(--accent)' }}>₹{cart.reduce((s, i) => s + i.price, 0)}</span>
                  </div>
                  <button style={{ width: '100%', marginTop: 20, background: 'var(--accent)', color: '#0C0C0F', border: 'none', borderRadius: 12, padding: '14px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          } />

          {/* Admin routes */}
          <Route path="/admin"          element={<AdminDashboard />} />
          <Route path="/admin/orders"   element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users"    element={<AdminUsers />} />
        </Routes>
      </main>
      {!onAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
