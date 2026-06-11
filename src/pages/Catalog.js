import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';
import { categories } from '../data/products';

export default function Catalog({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (search) params.search = search;
        if (sortBy !== 'default') params.sort = sortBy;
        if (maxPrice < 2000) params.maxPrice = maxPrice;

        const data = await productsAPI.getAll(params);
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [activeCategory, search, sortBy, maxPrice]);

  return (
    <div style={{ paddingTop: 88 }}>
      <div style={{
        padding: '40px 5% 32px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(168,230,61,0.03) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12, color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Ready-Made</span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 40, letterSpacing: '-1px', color: 'var(--text)', marginTop: 6, marginBottom: 20 }}>Product Catalog</h1>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, minWidth: 240, background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
            }}>
              <Search size={16} color="var(--text-subtle)" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prints..."
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, padding: '12px 0', fontFamily: 'Inter', flex: 1 }} />
              {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}><X size={14} /></button>}
            </div>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
              padding: '0 16px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: 14, cursor: 'pointer', outline: 'none', minWidth: 160,
            }}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>

            <button onClick={() => setFiltersOpen(!filtersOpen)} style={{
              background: filtersOpen ? 'rgba(168,230,61,0.1)' : 'var(--bg-card)',
              border: `1px solid ${filtersOpen ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 12, padding: '0 16px',
              color: filtersOpen ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'Space Grotesk', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, height: 46,
            }}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {filtersOpen && (
            <div style={{ marginTop: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Max Price: ₹{maxPrice}
              </label>
              <input type="range" min={0} max={2000} step={50} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ accentColor: 'var(--accent)', width: 180 }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 5%' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-card)',
              border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 8, padding: '6px 16px',
              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13,
              color: activeCategory === cat ? '#0C0C0F' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.18s',
            }}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading products...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#E42D2D', fontSize: 14 }}>Failed to load products: {error}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 24 }}>{products.length} products found</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {products.map(p => <ProductCard key={p._id} product={p} onAddToCart={onAddToCart} />)}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Try a different search or add products from the admin panel</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} style={{
              marginTop: 20, background: 'none', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 20px', color: 'var(--text-muted)',
              fontFamily: 'Space Grotesk', fontSize: 13, cursor: 'pointer',
            }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
