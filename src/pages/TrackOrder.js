import React, { useState } from 'react';
import { Search, Package, Printer, CheckCircle, Truck, Clock } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STAGES = [
  { icon: Package,     label: 'Order Confirmed',  desc: 'Payment received, queued for printing' },
  { icon: Printer,     label: 'Printing',          desc: 'Your part is being printed on the P1S' },
  { icon: CheckCircle, label: 'Quality Check',     desc: 'Inspecting dimensions and finish' },
  { icon: Truck,       label: 'Out for Delivery',  desc: 'On its way to you in Bangalore' },
];

const STATUS_TO_STAGE = { pending: 0, confirmed: 0, printing: 1, quality_check: 2, dispatched: 3, delivered: 4 };

export default function TrackOrder() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (!user) { setError('Please sign in to track your order.'); return; }
    setLoading(true); setError(''); setOrder(null);
    try {
      const data = await ordersAPI.track(query.trim().toUpperCase());
      setOrder(data.order);
    } catch (err) {
      setError('Order not found. Check your order ID.');
    } finally {
      setLoading(false);
    }
  };

  const stageIndex = order ? (STATUS_TO_STAGE[order.status] ?? 0) : 0;

  return (
    <div style={{ paddingTop: 88, minHeight: '100vh' }}>
      <div style={{ padding: '40px 5% 40px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(180deg, rgba(168,230,61,0.03) 0%, transparent 100%)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12, color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Tracking</span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 40, letterSpacing: '-1px', color: 'var(--text)', marginTop: 6, marginBottom: 8 }}>Track Your Order</h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28 }}>Enter your order ID to see real-time print status.</p>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. PF-0001"
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 15, fontFamily: 'Space Grotesk', fontWeight: 600, padding: '14px 0', flex: 1, letterSpacing: '0.5px' }} />
            </div>
            <button onClick={handleSearch} disabled={loading} style={{
              background: 'var(--accent)', color: '#0C0C0F', border: 'none', borderRadius: 12, padding: '0 24px',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Search size={16} /> {loading ? '...' : 'Track'}
            </button>
          </div>
          {!user && <p style={{ fontSize: 12, color: '#E4B82D', marginTop: 10 }}>⚠ Sign in to track your orders.</p>}
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 5%' }}>
        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🤔</div>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>Order not found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{error}</p>
          </div>
        )}

        {order && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'Space Grotesk', marginBottom: 4 }}>ORDER ID</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>{order.orderId}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginBottom: 4 }}>TOTAL</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>₹{order.pricing?.total}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>
                  {order.type === 'custom' ? `Custom: ${order.customFile?.filename}` : order.product?.name}
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Material: <b style={{ color: 'var(--text)' }}>{order.settings?.material}</b></span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Placed: <b style={{ color: 'var(--text)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</b></span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 28 }}>Print Progress</h3>
              {STAGES.map(({ icon: Icon, label, desc }, i) => {
                const done = i < stageIndex;
                const active = i === stageIndex;
                return (
                  <div key={label} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                    {i < STAGES.length - 1 && (
                      <div style={{ position: 'absolute', left: 18, top: 40, width: 2, height: 48, background: done ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s' }} />
                    )}
                    <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: done ? 'var(--accent)' : active ? 'rgba(168,230,61,0.12)' : 'var(--bg)', border: `2px solid ${done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                      <Icon size={16} color={done ? '#0C0C0F' : active ? 'var(--accent)' : 'var(--text-subtle)'} />
                    </div>
                    <div style={{ paddingBottom: 32 }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 14, color: done || active ? 'var(--text)' : 'var(--text-subtle)', marginBottom: 3 }}>
                        {label}
                        {active && <span style={{ marginLeft: 10, background: 'rgba(168,230,61,0.12)', border: '1px solid rgba(168,230,61,0.3)', borderRadius: 4, padding: '2px 8px', fontSize: 11, color: 'var(--accent)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>In Progress</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                      {active && order.statusHistory?.length > 0 && (
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={11} color="var(--text-subtle)" />
                          <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                            Last updated: {new Date(order.statusHistory[order.statusHistory.length - 1].updatedAt).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
