import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { Package, LogOut, User, Clock } from 'lucide-react';

const STATUS_COLORS = {
  pending:       { bg: 'rgba(228,184,45,0.1)',  color: '#E4B82D', label: 'Pending' },
  confirmed:     { bg: 'rgba(168,230,61,0.1)',  color: '#A8E63D', label: 'Confirmed' },
  printing:      { bg: 'rgba(45,107,228,0.1)',  color: '#6B9FE4', label: 'Printing' },
  quality_check: { bg: 'rgba(168,230,61,0.1)',  color: '#A8E63D', label: 'QC' },
  dispatched:    { bg: 'rgba(45,228,139,0.1)',  color: '#2DE48A', label: 'Dispatched' },
  delivered:     { bg: 'rgba(168,230,61,0.15)', color: '#A8E63D', label: 'Delivered' },
  cancelled:     { bg: 'rgba(228,45,45,0.1)',   color: '#E42D2D', label: 'Cancelled' },
};

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>Welcome back</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Sign in to track your orders.</p>

      {error && <div style={{ background: 'rgba(228,45,45,0.1)', border: '1px solid rgba(228,45,45,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#E42D2D', fontSize: 13 }}>{error}</div>}

      {[{ label: 'Email', value: email, set: setEmail, type: 'email' }, { label: 'Password', value: password, set: setPassword, type: 'password' }].map(({ label, value, set, type }) => (
        <div key={label} style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>{label}</label>
          <input type={type} value={value} onChange={e => set(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', color: 'var(--text)', fontFamily: 'Inter', fontSize: 14, outline: 'none' }} />
        </div>
      ))}

      <button onClick={handleSubmit} disabled={loading} style={{
        width: '100%', background: 'var(--accent)', color: '#0C0C0F', border: 'none',
        borderRadius: 12, padding: '14px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 8,
      }}>{loading ? 'Signing in...' : 'Sign In'}</button>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
        No account?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13 }}>Create one</button>
      </p>
    </div>
  );
}

function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password, form.phone);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', key: 'name', type: 'text' },
    { label: 'Email', key: 'email', type: 'email' },
    { label: 'Phone', key: 'phone', type: 'tel' },
    { label: 'Password', key: 'password', type: 'password' },
  ];

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>Create account</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Start ordering custom 3D prints.</p>

      {error && <div style={{ background: 'rgba(228,45,45,0.1)', border: '1px solid rgba(228,45,45,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#E42D2D', fontSize: 13 }}>{error}</div>}

      {fields.map(({ label, key, type }) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>{label}</label>
          <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', color: 'var(--text)', fontFamily: 'Inter', fontSize: 14, outline: 'none' }} />
        </div>
      ))}

      <button onClick={handleSubmit} disabled={loading} style={{
        width: '100%', background: 'var(--accent)', color: '#0C0C0F', border: 'none',
        borderRadius: 12, padding: '14px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 8,
      }}>{loading ? 'Creating...' : 'Create Account'}</button>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13 }}>Sign in</button>
      </p>
    </div>
  );
}

export default function Account() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      ordersAPI.getMine()
        .then(data => setOrders(data.orders))
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  return (
    <div style={{ paddingTop: 88, minHeight: '100vh' }}>
      <div style={{ padding: '40px 5% 40px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(180deg, rgba(168,230,61,0.03) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12, color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Account</span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 40, letterSpacing: '-1px', color: 'var(--text)', marginTop: 6 }}>
            {user ? `Hey, ${user.name.split(' ')[0]} 👋` : 'My Account'}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 5%' }}>
        {!user ? (
          showLogin
            ? <LoginForm onSwitch={() => setShowLogin(false)} />
            : <RegisterForm onSwitch={() => setShowLogin(true)} />
        ) : (
          <div>
            {/* Profile card */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(168,230,61,0.12)', border: '2px solid rgba(168,230,61,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={22} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{user.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>
              <button onClick={logout} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <LogOut size={13} /> Sign out
              </button>
            </div>

            {/* Orders */}
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 20 }}>Your Orders</h3>

            {loadingOrders ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px', textAlign: 'center' }}>
                <Package size={36} color="var(--text-subtle)" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>No orders yet. Place your first print!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.map(order => {
                  const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                  return (
                    <div key={order._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: 'var(--accent)', marginBottom: 4 }}>{order.orderId}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{order.type === 'custom' ? `Custom: ${order.customFile?.filename || 'file'}` : order.product?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>₹{order.pricing?.total}</div>
                        <div style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30`, borderRadius: 6, padding: '4px 10px', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12 }}>
                          {s.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
