import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Layers, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/custom', label: 'Custom Order' },
    { to: '/track', label: 'Track Order' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(12,12,15,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 5%',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} color="#0C0C0F" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.3px' }}>
              Print<span style={{ color: 'var(--accent)' }}>Forge</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                textDecoration: 'none',
                fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 14,
                color: location.pathname === to ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'color 0.2s', letterSpacing: '0.2px',
              }}
              onMouseEnter={e => { if (location.pathname !== to) e.target.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (location.pathname !== to) e.target.style.color = 'var(--text-muted)'; }}
              >{label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', cursor: 'pointer' }}>
                <ShoppingCart size={18} color="var(--text-muted)" />
                {cartCount > 0 && (
                  <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 10, color: '#0C0C0F' }}>{cartCount}</div>
                )}
              </div>
            </Link>

            {/* Auth button — shows user avatar if logged in, Sign In if not */}
            <Link to="/account" style={{ textDecoration: 'none' }}>
              {user ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '6px 14px', cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(168,230,61,0.15)', border: '1.5px solid rgba(168,230,61,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={13} color="var(--accent)" />
                  </div>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
              ) : (
                <button style={{
                  background: 'var(--accent)', color: '#0C0C0F',
                  border: 'none', borderRadius: 10, padding: '9px 20px',
                  fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                }}>Sign In</button>
              )}
            </Link>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', color: 'var(--text)' }} className="mobile-menu-btn">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 68, left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 99, padding: '32px 5%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none', padding: '14px 0', fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 20, color: location.pathname === to ? 'var(--accent)' : 'var(--text)', borderBottom: '1px solid var(--border)' }}>{label}</Link>
          ))}
          <Link to="/account" style={{ textDecoration: 'none', padding: '14px 0', fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 20, color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
            {user ? user.name : 'Sign In'}
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
