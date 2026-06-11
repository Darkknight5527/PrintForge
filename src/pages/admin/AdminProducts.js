import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { adminAPI, productsAPI } from '../../services/api';
import AdminLayout from './AdminLayout';

const EMPTY_FORM = { name: '', description: '', category: 'Home & Office', material: 'PLA', price: '', color: '#A8E63D', printTime: '', infill: 20, tags: [] };
const CATEGORIES = ['Home & Office', 'Electronics', 'Hobby', 'Robotics', 'Personalized'];
const MATERIALS  = ['PLA', 'PLA+', 'PETG', 'PETG-CF', 'TPU', 'ABS'];
const TAGS       = ['bestseller', 'featured', 'popular', 'customizable', 'new'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    productsAPI.getAll()
      .then(data => setProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); setError(''); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, category: p.category, material: p.material, price: p.price, color: p.color || '#A8E63D', printTime: p.printTime || '', infill: p.infill || 20, tags: p.tags || [] });
    setEditingId(p._id);
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return setError('Name and price are required.');
    setSaving(true); setError('');
    try {
      if (editingId) {
        await adminAPI.updateProduct(editingId, form);
      } else {
        await adminAPI.createProduct(form);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 4 }}>Products</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{products.length} products in catalog</p>
          </div>
          <button onClick={openAdd} style={{
            background: 'var(--accent)', color: '#0C0C0F', border: 'none', borderRadius: 10,
            padding: '10px 20px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>

              {error && <div style={{ background: 'rgba(228,45,45,0.1)', border: '1px solid rgba(228,45,45,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#E42D2D', fontSize: 13 }}>{error}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Product Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'Inter', fontSize: 14, outline: 'none' }} />
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Description *</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'Inter', fontSize: 14, outline: 'none', resize: 'vertical' }} />
                </div>

                {/* Category */}
                <div>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'Space Grotesk', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Material */}
                <div>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Material</label>
                  <select value={form.material} onChange={e => setForm({ ...form, material: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'Space Grotesk', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                    {MATERIALS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'Inter', fontSize: 14, outline: 'none' }} />
                </div>

                {/* Print time */}
                <div>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Print Time (e.g. 4h)</label>
                  <input value={form.printTime} onChange={e => setForm({ ...form, printTime: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'Inter', fontSize: 14, outline: 'none' }} />
                </div>

                {/* Color */}
                <div>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Accent Color</label>
                  <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                    style={{ width: '100%', height: 40, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', padding: 4 }} />
                </div>

                {/* Infill */}
                <div>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    Default Infill <span style={{ color: 'var(--accent)' }}>{form.infill}%</span>
                  </label>
                  <input type="range" min={10} max={100} step={5} value={form.infill} onChange={e => setForm({ ...form, infill: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--accent)', marginTop: 8 }} />
                </div>

                {/* Tags */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>Tags</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {TAGS.map(tag => (
                      <button key={tag} onClick={() => toggleTag(tag)} style={{
                        background: form.tags.includes(tag) ? 'rgba(168,230,61,0.1)' : 'var(--bg)',
                        border: `1px solid ${form.tags.includes(tag) ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 8, padding: '5px 12px', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12,
                        color: form.tags.includes(tag) ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer',
                      }}>{tag}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{
                  background: 'var(--accent)', color: '#0C0C0F', border: 'none', borderRadius: 10,
                  padding: '10px 24px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <Save size={14} /> {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 20 }}>No products yet. Add your first product!</p>
            <button onClick={openAdd} style={{ background: 'var(--accent)', color: '#0C0C0F', border: 'none', borderRadius: 10, padding: '10px 24px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              + Add First Product
            </button>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Product', 'Category', 'Material', 'Price', 'Tags', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id} style={{ borderBottom: i < products.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color || '#A8E63D', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)' }}>{p.category}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)' }}>{p.material}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>₹{p.price}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.tags?.map(t => (
                          <span key={t} style={{ background: 'rgba(168,230,61,0.08)', color: 'var(--accent)', border: '1px solid rgba(168,230,61,0.2)', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontFamily: 'Space Grotesk', fontWeight: 600 }}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Pencil size={12} /> <span style={{ fontSize: 12, fontFamily: 'Space Grotesk' }}>Edit</span>
                        </button>
                        <button onClick={() => handleDelete(p._id)} style={{ background: 'none', border: '1px solid rgba(228,45,45,0.3)', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', color: '#E42D2D', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 size={12} /> <span style={{ fontSize: 12, fontFamily: 'Space Grotesk' }}>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
