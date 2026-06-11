import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from './AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getUsers()
      .then(data => setUsers(data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 4 }}>Customers</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{users.length} registered customers</p>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 16px', color: 'var(--text)', fontFamily: 'Inter', fontSize: 14, outline: 'none', width: 260 }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map(user => (
              <div key={user._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(168,230,61,0.1)', border: '2px solid rgba(168,230,61,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={18} color="var(--accent)" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'Space Grotesk', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user.role}</div>
                  </div>
                </div>

                {[
                  { icon: Mail,     value: user.email },
                  { icon: Phone,    value: user.phone || 'No phone' },
                  { icon: Calendar, value: `Joined ${new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` },
                ].map(({ icon: Icon, value }) => (
                  <div key={value} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Icon size={13} color="var(--text-subtle)" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>No customers found.</div>
        )}
      </div>
    </AdminLayout>
  );
}
