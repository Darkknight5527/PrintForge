import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Layers, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products', icon: Package,          label: 'Products' },
  { to: '/admin/users',    icon: Users,            label: 'Customers' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect non-admins
  if (user && user.role !== 'admin') {
    navigate('/');
    return null;
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Space Grotesk', color: 'var(--text)', marginBottom: 16 }}>Admin access required</h2>
          <Link to="/account" style={{ color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        background: '#080809',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Layers size={18} color="#0C0C0F" strokeWidth={2.5} />
          </div>
          {sidebarOpen && (
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              Print<span style={{ color: 'var(--accent)' }}>Forge</span>
              <span style={{ fontSize: 10, color: 'var(--text-subtle)', display: 'block', fontWeight: 500, marginTop: -2 }}>Admin Panel</span>
            </span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', marginLeft: 'auto', flexShrink: 0 }}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 8px' }}>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                background: active ? 'rgba(168,230,61,0.1)' : 'transparent',
                border: `1px solid ${active ? 'rgba(168,230,61,0.2)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-card)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} color={active ? 'var(--accent)' : 'var(--text-subtle)'} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: active ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '16px 8px', borderTop: '1px solid var(--border)' }}>
          {sidebarOpen && (
            <div style={{ padding: '8px 12px', marginBottom: 8 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
          )}
          <button onClick={() => { logout(); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 10, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)' }}>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 72, transition: 'margin-left 0.25s ease', minHeight: '100vh', padding: '32px' }}>
        {children}
      </main>
    </div>
  );
}
