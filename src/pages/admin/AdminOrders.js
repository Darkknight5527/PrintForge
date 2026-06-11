import React, { useEffect, useState } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from './AdminLayout';

const STATUSES = ['pending', 'confirmed', 'printing', 'quality_check', 'dispatched', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending:       { bg: 'rgba(228,184,45,0.1)',  color: '#E4B82D' },
  confirmed:     { bg: 'rgba(168,230,61,0.1)',  color: '#A8E63D' },
  printing:      { bg: 'rgba(45,107,228,0.1)',  color: '#6B9FE4' },
  quality_check: { bg: 'rgba(45,228,139,0.1)',  color: '#2DE48A' },
  dispatched:    { bg: 'rgba(138,45,228,0.1)',  color: '#A87DE4' },
  delivered:     { bg: 'rgba(168,230,61,0.15)', color: '#A8E63D' },
  cancelled:     { bg: 'rgba(228,45,45,0.1)',   color: '#E42D2D' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [priceInput, setPriceInput] = useState({});
  const [noteInput, setNoteInput] = useState({});

  const fetchOrders = () => {
    setLoading(true);
    const params = filterStatus ? { status: filterStatus } : {};
    adminAPI.getOrders(params)
      .then(data => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminAPI.updateStatus(orderId, newStatus, noteInput[orderId] || '');
      fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmPrice = async (orderId) => {
    const price = Number(priceInput[orderId]);
    if (!price) return alert('Enter a valid price');
    setUpdatingId(orderId);
    try {
      await adminAPI.confirmPrice(orderId, price, noteInput[orderId] || '');
      fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 4 }}>Orders</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{orders.length} orders found</p>
          </div>

          {/* Filter by status */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '9px 16px', color: 'var(--text)', fontFamily: 'Space Grotesk', fontSize: 13, cursor: 'pointer', outline: 'none',
          }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No orders found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map(order => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const isExpanded = expandedOrder === order._id;

              return (
                <div key={order._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  {/* Order row */}
                  <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', cursor: 'pointer' }}
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                    <div style={{ flex: '0 0 100px' }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>{order.orderId}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{order.user?.name || '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.user?.email}</div>
                    </div>
                    <div style={{ flex: '0 0 80px' }}>
                      <span style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{order.type}</span>
                    </div>
                    <div style={{ flex: '0 0 90px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
                      ₹{order.pricing?.total || '—'}
                      {!order.pricing?.isConfirmed && <div style={{ fontSize: 10, color: '#E4B82D', fontWeight: 500 }}>unconfirmed</div>}
                    </div>
                    <div style={{ flex: '0 0 120px' }}>
                      <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30`, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600, textTransform: 'capitalize' }}>
                        {order.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <ChevronDown size={16} color="var(--text-subtle)" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </div>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '24px', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Order details */}
                        <div>
                          <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Order Details</h4>
                          {[
                            ['Material', order.settings?.material],
                            ['Quality', order.settings?.quality],
                            ['Infill', `${order.settings?.infill}%`],
                            ['Quantity', order.settings?.quantity],
                            ['File', order.customFile?.filename || order.product?.name || '—'],
                            ['Notes', order.settings?.notes || '—'],
                          ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 12, color: 'var(--text-subtle)', minWidth: 70 }}>{k}:</span>
                              <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{v}</span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div>
                          {/* Confirm price for custom orders */}
                          {!order.pricing?.isConfirmed && (
                            <div style={{ marginBottom: 20 }}>
                              <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: '#E4B82D', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Confirm Price</h4>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                  type="number"
                                  placeholder="Final price ₹"
                                  value={priceInput[order._id] || ''}
                                  onChange={e => setPriceInput({ ...priceInput, [order._id]: e.target.value })}
                                  style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontFamily: 'Space Grotesk', fontSize: 13, outline: 'none' }}
                                />
                                <button onClick={() => handleConfirmPrice(order._id)} disabled={updatingId === order._id} style={{
                                  background: 'var(--accent)', color: '#0C0C0F', border: 'none', borderRadius: 8,
                                  padding: '8px 16px', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: 6,
                                }}>
                                  <CheckCircle size={13} /> Confirm
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Update status */}
                          <div>
                            <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Update Status</h4>
                            <input
                              placeholder="Note (optional)"
                              value={noteInput[order._id] || ''}
                              onChange={e => setNoteInput({ ...noteInput, [order._id]: e.target.value })}
                              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontFamily: 'Inter', fontSize: 13, outline: 'none', marginBottom: 10 }}
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {STATUSES.filter(s => s !== order.status).map(s => (
                                <button key={s} onClick={() => handleStatusUpdate(order._id, s)} disabled={updatingId === order._id} style={{
                                  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8,
                                  padding: '6px 12px', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12,
                                  color: STATUS_COLORS[s]?.color || 'var(--text-muted)', cursor: 'pointer',
                                  textTransform: 'capitalize',
                                }}>
                                  → {s.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
