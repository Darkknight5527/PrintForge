import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Zap, CheckCircle } from 'lucide-react';
import { materials } from '../data/products';

const MATERIAL_PRICES = { PLA: 1.2, 'PLA+': 1.5, PETG: 1.8, 'PETG-CF': 2.8, TPU: 2.2, ABS: 1.6 };
const QUALITY_OPTIONS = [
  { label: 'Draft (0.3mm)', value: 0.3, time: 0.7 },
  { label: 'Standard (0.2mm)', value: 0.2, time: 1.0 },
  { label: 'Fine (0.1mm)', value: 0.1, time: 1.6 },
];

export default function CustomOrder({ onAddToCart }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [material, setMaterial] = useState('PLA');
  const [infill, setInfill] = useState(20);
  const [quality, setQuality] = useState(QUALITY_OPTIONS[1]);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('#A8E63D');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1); // 1=upload, 2=config, 3=review
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef();

  // Estimate: simulate based on file name/size and settings
  const baseVolume = file ? Math.min(file.size / 1024, 200) : 80; // cm³ approximation
  const materialCost = baseVolume * MATERIAL_PRICES[material] * 0.9;
  const infillMultiplier = 0.6 + (infill / 100) * 0.8;
  const qualityMultiplier = quality.time;
  const printHours = (baseVolume / 40) * infillMultiplier * qualityMultiplier;
  const laborCost = printHours * 35;
  const total = Math.round((materialCost + laborCost + 50) * quantity); // +50 base fee
  const estTime = Math.ceil(printHours);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.stl') || f.name.endsWith('.obj') || f.name.endsWith('.3mf'))) {
      setFile(f);
      setStep(2);
    }
  };

  const handleFileInput = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setStep(2); }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onAddToCart?.({ name: `Custom: ${file?.name}`, price: total, id: Date.now(), material, quantity });
  };

  const colorOptions = ['#A8E63D', '#2D6BE4', '#E42D2D', '#E4B82D', '#8A2DE4', '#2DE4C8', '#FFFFFF', '#1A1A1A'];

  return (
    <div style={{ paddingTop: 88, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '40px 5% 40px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(168,230,61,0.03) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 12, color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Custom Print
          </span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 40, letterSpacing: '-1px', color: 'var(--text)', marginTop: 6, marginBottom: 8 }}>
            Upload Your Design
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
            STL, OBJ, or 3MF files. We'll print it and deliver in Bangalore within 48 hours.
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 0, marginTop: 32 }}>
            {['Upload File', 'Configure Print', 'Review & Order'].map((label, i) => {
              const s = i + 1;
              const active = step === s;
              const done = step > s;
              return (
                <React.Fragment key={label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: done ? 'var(--accent)' : active ? 'rgba(168,230,61,0.15)' : 'var(--bg-card)',
                      border: `2px solid ${done || active ? 'var(--accent)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
                      color: done ? '#0C0C0F' : active ? 'var(--accent)' : 'var(--text-subtle)',
                      flexShrink: 0,
                    }}>
                      {done ? <CheckCircle size={14} color="#0C0C0F" /> : s}
                    </div>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: active ? 'var(--text)' : 'var(--text-subtle)' }}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: done ? 'var(--accent)' : 'var(--border)', margin: '0 12px', alignSelf: 'center', maxWidth: 60 }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 5%' }}>
        {submitted ? (
          /* Success state */
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(168,230,61,0.12)', border: '2px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
            }}>
              <CheckCircle size={36} color="var(--accent)" />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 12 }}>Order Placed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 8 }}>Your file is in the queue. We'll email you when printing starts.</p>
            <p style={{ color: 'var(--text-subtle)', fontSize: 13 }}>Estimated completion: {estTime}–{estTime + 2} hours</p>
            <div style={{
              marginTop: 32, background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '20px 28px', display: 'inline-block', textAlign: 'left',
            }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Order Total</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: 'var(--accent)' }}>₹{total}</div>
            </div>
          </div>
        ) : (
          <>
            {/* STEP 1: File Upload */}
            <div style={{ marginBottom: 32 }}>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--accent)' : file ? 'rgba(168,230,61,0.4)' : 'var(--border-light)'}`,
                  borderRadius: 20, padding: '48px 32px', textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'rgba(168,230,61,0.04)' : file ? 'rgba(168,230,61,0.02)' : 'var(--bg-card)',
                  transition: 'all 0.2s',
                }}
              >
                <input ref={fileInputRef} type="file" accept=".stl,.obj,.3mf" onChange={handleFileInput} style={{ display: 'none' }} />

                {file ? (
                  <div>
                    <div style={{
                      width: 56, height: 56, borderRadius: 14,
                      background: 'rgba(168,230,61,0.12)', border: '1px solid rgba(168,230,61,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                    }}>
                      <FileText size={26} color="var(--accent)" />
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); setStep(1); }}
                      style={{
                        background: 'none', border: '1px solid var(--border)', borderRadius: 8,
                        padding: '6px 14px', color: 'var(--text-muted)', cursor: 'pointer',
                        fontFamily: 'Space Grotesk', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}>
                      <X size={12} /> Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      width: 64, height: 64, borderRadius: 16,
                      background: 'rgba(168,230,61,0.06)', border: '1px solid rgba(168,230,61,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                    }}>
                      <Upload size={28} color="var(--accent)" />
                    </div>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>
                      Drop your file here
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
                      Supports .STL, .OBJ, .3MF — up to 100MB
                    </p>
                    <div style={{
                      display: 'inline-block', background: 'var(--accent)', color: '#0C0C0F',
                      borderRadius: 10, padding: '10px 24px',
                      fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 14,
                    }}>
                      Browse Files
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: Configure */}
            {step >= 2 && (
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 20, padding: '32px', marginBottom: 24,
              }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 28 }}>
                  Print Settings
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Material */}
                  <div>
                    <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>
                      Material
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {materials.map(m => (
                        <button key={m} onClick={() => setMaterial(m)} style={{
                          background: material === m ? 'rgba(168,230,61,0.1)' : 'var(--bg)',
                          border: `1px solid ${material === m ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 10, padding: '9px 14px',
                          fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13,
                          color: material === m ? 'var(--accent)' : 'var(--text-muted)',
                          cursor: 'pointer', textAlign: 'left',
                        }}>{m}</button>
                      ))}
                    </div>
                  </div>

                  {/* Right side options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Quality */}
                    <div>
                      <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>
                        Layer Quality
                      </label>
                      {QUALITY_OPTIONS.map(q => (
                        <button key={q.value} onClick={() => { setQuality(q); if (step < 3) setStep(3); }} style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          background: quality.value === q.value ? 'rgba(168,230,61,0.08)' : 'var(--bg)',
                          border: `1px solid ${quality.value === q.value ? 'var(--accent)' : 'var(--border)'}`,
                          borderRadius: 10, padding: '9px 14px', marginBottom: 6,
                          fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13,
                          color: quality.value === q.value ? 'var(--accent)' : 'var(--text-muted)',
                          cursor: 'pointer',
                        }}>{q.label}</button>
                      ))}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>
                        Quantity
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{
                          width: 36, height: 36, borderRadius: 8, background: 'var(--bg)',
                          border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: 18,
                        }}>−</button>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: 'var(--text)', minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} style={{
                          width: 36, height: 36, borderRadius: 8, background: 'var(--bg)',
                          border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: 18,
                        }}>+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Infill slider */}
                <div style={{ marginTop: 24 }}>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    Infill Density
                    <span style={{ color: 'var(--accent)' }}>{infill}%</span>
                  </label>
                  <input
                    type="range" min={10} max={100} step={5}
                    value={infill}
                    onChange={e => { setInfill(Number(e.target.value)); setStep(3); }}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Light (10%)</span>
                    <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Solid (100%)</span>
                  </div>
                </div>

                {/* Color */}
                <div style={{ marginTop: 24 }}>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 12 }}>
                    Filament Color
                  </label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {colorOptions.map(c => (
                      <div key={c} onClick={() => setColor(c)} style={{
                        width: 32, height: 32, borderRadius: '50%', background: c,
                        cursor: 'pointer', border: `3px solid ${color === c ? 'var(--text)' : 'transparent'}`,
                        transition: 'border-color 0.15s', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      }} />
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginTop: 24 }}>
                  <label style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>
                    Special Instructions (optional)
                  </label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="E.g. need supports, specific orientation, post-processing..."
                    style={{
                      width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 10, padding: '12px 16px', color: 'var(--text)',
                      fontFamily: 'Inter', fontSize: 14, resize: 'vertical', minHeight: 80, outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Quote + Order */}
            {step >= 3 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(168,230,61,0.06) 0%, rgba(168,230,61,0.02) 100%)',
                border: '1px solid rgba(168,230,61,0.2)',
                borderRadius: 20, padding: '28px 32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Zap size={16} color="var(--accent)" />
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: 'var(--accent)' }}>Instant Quote</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
                  {[
                    { label: 'Material', value: material },
                    { label: 'Print Time', value: `~${estTime}h` },
                    { label: 'Quantity', value: `×${quantity}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: 'rgba(12,12,15,0.5)', borderRadius: 12, padding: '14px 16px' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-subtle)', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(168,230,61,0.15)', paddingTop: 20 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total Estimate</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 36, color: 'var(--text)' }}>
                      ₹{total}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>Final price confirmed by admin</div>
                  </div>

                  <button onClick={handleSubmit} style={{
                    background: 'var(--accent)', color: '#0C0C0F',
                    border: 'none', borderRadius: 14, padding: '16px 32px',
                    fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16,
                    cursor: 'pointer', transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Place Order →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
