import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Package, Truck, CheckCircle, Zap, Shield } from 'lucide-react';
import PrintAnimation from '../components/PrintAnimation';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Home({ onAddToCart }) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { value: '500+', label: 'Orders Delivered' },
    { value: '0.1mm', label: 'Layer Resolution' },
    { value: '48hr', label: 'Avg Turnaround' },
    { value: '4.9★', label: 'Customer Rating' },
  ];

  const howItWorks = [
    { icon: Upload, title: 'Upload or Choose', desc: 'Upload your STL/OBJ file for a custom print, or pick from our ready-made catalog.' },
    { icon: Zap, title: 'Instant Quote', desc: 'Get a price in seconds based on material, volume, and infill settings.' },
    { icon: Package, title: 'We Print It', desc: 'Your order goes to our Bambu Lab P1S — 256mm³ build volume, multi-material capable.' },
    { icon: Truck, title: 'Delivered to You', desc: 'Packed carefully and shipped across Bangalore within 48 hours.' },
  ];

  const featured = products.slice(0, 3);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '100px 5% 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.25,
        }} />
        {/* Radial fade over grid */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 70% at 60% 40%, transparent 0%, var(--bg) 70%)',
        }} />

        <div className="hero-flex" style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: 60, position: 'relative' }}>
          {/* Left copy */}
          <div style={{ flex: 1 }}>
            {/* Eyebrow */}
            <div className="fade-up" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.2)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 28,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-accent 2s infinite' }} />
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12, color: 'var(--accent)', letterSpacing: '0.5px' }}>
                Bangalore's FDM Print Studio
              </span>
            </div>

            <h1 className="fade-up-delay-1" style={{
              fontFamily: 'Space Grotesk', fontWeight: 700,
              fontSize: 'clamp(40px, 5vw, 64px)',
              lineHeight: 1.05, letterSpacing: '-1.5px',
              color: 'var(--text)', marginBottom: 24,
            }}>
              Turn Your Ideas<br />
              Into{' '}
              <span style={{
                background: 'linear-gradient(90deg, var(--accent), #C8F070)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Physical Reality</span>
            </h1>

            <p className="fade-up-delay-2" style={{
              fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.7,
              maxWidth: 460, marginBottom: 36,
            }}>
              Professional FDM printing on the Bambu Lab P1S. Upload your design or order from our catalog — delivered in Bangalore within 48 hours.
            </p>

            <div className="fade-up-delay-3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/custom" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'var(--accent)', color: '#0C0C0F',
                  border: 'none', borderRadius: 12, padding: '14px 28px',
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(168,230,61,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Upload size={16} /> Upload Your File
                </button>
              </Link>
              <Link to="/catalog" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'transparent', color: 'var(--text)',
                  border: '1px solid var(--border-light)', borderRadius: 12, padding: '14px 28px',
                  fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 15,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                >
                  Browse Catalog <ArrowRight size={16} />
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
              {[
                { icon: Shield, text: 'Quality guaranteed' },
                { icon: Zap, text: '48hr turnaround' },
                { icon: CheckCircle, text: 'Bambu Lab P1S' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Icon size={13} color="var(--accent)" />
                  <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Print Animation */}
          <div className="hero-animation" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PrintAnimation />
            {/* Printer spec tag */}
            <div style={{
              marginTop: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12, color: 'var(--text-muted)' }}>
                Bambu Lab P1S · 0.4mm · AMS Multi-color
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{
        background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: '28px 5%',
      }}>
        <div className="stats-bar" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--accent)', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.3px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12, color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Process</span>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 38, letterSpacing: '-0.8px', color: 'var(--text)', marginTop: 8 }}>
              From File to Doorstep
            </h2>
          </div>

          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
            {/* Connector line */}
            <div style={{
              position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 1,
              background: 'linear-gradient(90deg, transparent, var(--border), var(--border), transparent)',
            }} />

            {howItWorks.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '28px 24px', textAlign: 'center',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(168,230,61,0.08)', border: '1px solid rgba(168,230,61,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Icon size={22} color="var(--accent)" />
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: '20px 5% 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12, color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Catalog</span>
              <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 38, letterSpacing: '-0.8px', color: 'var(--text)', marginTop: 6 }}>
                Ready to Print
              </h2>
            </div>
            <Link to="/catalog" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent', color: 'var(--accent)',
                border: '1px solid rgba(168,230,61,0.3)', borderRadius: 10, padding: '10px 20px',
                fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}>View All <ArrowRight size={14} /></button>
            </Link>
          </div>

          <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
          </div>
        </div>
      </section>

      {/* ── MATERIALS STRIP ── */}
      <section style={{
        padding: '60px 5%',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: 32 }}>
            Materials Available
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {[
              { name: 'PLA', note: 'Standard', color: '#A8E63D' },
              { name: 'PLA+', note: 'Stronger', color: '#7AB829' },
              { name: 'PETG', note: 'Chemical resistant', color: '#2D9BE4' },
              { name: 'PETG-CF', note: 'Carbon fill', color: '#4A4A5A' },
              { name: 'TPU', note: 'Flexible', color: '#E4672D' },
              { name: 'ABS', note: 'Heat resistant', color: '#E4B82D' },
            ].map(({ name, note, color }) => (
              <div key={name} style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 20px', textAlign: 'center', minWidth: 110,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, margin: '0 auto 8px' }} />
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(168,230,61,0.05) 0%, rgba(168,230,61,0.02) 100%)',
            border: '1px solid rgba(168,230,61,0.15)',
            borderRadius: 24, padding: '60px 40px',
          }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 36, letterSpacing: '-0.8px', color: 'var(--text)', marginBottom: 16 }}>
              Have a design in mind?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
              Upload your STL or OBJ file and get an instant quote. We print in PLA, PETG, TPU, and more.
            </p>
            <Link to="/custom" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'var(--accent)', color: '#0C0C0F',
                border: 'none', borderRadius: 12, padding: '16px 36px',
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <Upload size={18} /> Start Custom Order
              </button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .hero-flex { flex-direction: column !important; text-align: center; padding-top: 90px !important; }
          .hero-animation { display: none !important; }
          .hero-flex .fade-up-delay-3 { justify-content: center; }
          .how-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .stats-bar { grid-template-columns: repeat(2,1fr) !important; }
          .featured-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .how-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
