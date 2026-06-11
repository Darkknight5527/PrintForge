import React, { useEffect, useState } from 'react';
import { ShoppingBag, Users, Package, DollarSign, Clock, Printer } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from './AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getDashboard(), adminAPI.getOrders({ limit: 5 })])
      .then(([dashData, ordersData]) => {
        setStats(dashData.stats);
        setRecentOrders(ordersData.orders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: ShoppingBag,  label: 'Total Orders',    value: stats.totalOrders,   color: '#2D6BE4' },
    { icon: Clock,        label: 'Pending',          value: stats.pendingOrders, color: '#E4B82D' },
    { icon: Printer,      label: 'Printing Now',     value: stats.printingOrders,color: '#A8E63D' },
    { icon: Users,        label: 'Customers',        value: stats.totalUsers,    color: '#8A2DE4' },
    { icon: Package,      label: 'Products',         value: stats.totalProducts, color: '#2DE48A' },
    { icon: DollarSign,   label: 'Total Revenue',    value: `₹${stats.totalRevenue}`, color: '#A8E63D' },
  ] : [];

  const STATUS_COLORS = {
    pending:       '#E4B82D',
    confirmed:     '#A8E63D',
    printing:      '#2D6BE4',
    quality_check: '#2DE48A',
    dispatched:    '#8A2DE4',
    delivered:     '#A8E63D',
    cancelled:     '#E42D2D',
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Welcome back, here's what's happening with PrintForge.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
              {statCards.map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 24, color: 'var(--text)' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Recent Orders</h2>
              </div>

              {recentOrders.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No orders yet.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Order ID', 'Customer', 'Type', 'Total', 'Status', 'Date'].map(h => (
                        <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={order._id} style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td style={{ padding: '14px 24px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>{order.orderId}</td>
                        <td style={{ padding: '14px 24px', fontSize: 13, color: 'var(--text)' }}>{order.user?.name || '—'}</td>
                        <td style={{ padding: '14px 24px' }}>
                          <span style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{order.type}</span>
                        </td>
                        <td style={{ padding: '14px 24px', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>₹{order.pricing?.total}</td>
                        <td style={{ padding: '14px 24px' }}>
                          <span style={{ background: `${STATUS_COLORS[order.status]}15`, color: STATUS_COLORS[order.status], border: `1px solid ${STATUS_COLORS[order.status]}30`, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600, textTransform: 'capitalize' }}>
                            {order.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '14px 24px', fontSize: 12, color: 'var(--text-subtle)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
