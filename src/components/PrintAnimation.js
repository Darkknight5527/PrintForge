import React, { useEffect, useRef } from 'react';

export default function PrintAnimation() {
  const svgRef = useRef(null);

  useEffect(() => {
    // Animate layers sequentially
    const layers = svgRef.current?.querySelectorAll('.print-layer');
    if (!layers) return;

    layers.forEach((layer, i) => {
      layer.style.opacity = '0';
      setTimeout(() => {
        layer.style.transition = 'opacity 0.4s ease';
        layer.style.opacity = '1';
      }, i * 120 + 300);
    });

    // Loop the animation every 5s
    const interval = setInterval(() => {
      layers.forEach((layer) => { layer.style.opacity = '0'; });
      layers.forEach((layer, i) => {
        setTimeout(() => {
          layer.style.transition = 'opacity 0.4s ease';
          layer.style.opacity = '1';
        }, i * 120 + 200);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Isometric-style 3D box being printed layer by layer
  const accentGreen = '#A8E63D';
  const dimGreen = '#4A6B1A';
  const border = '#2A2A35';

  // Define layers of an isometric box (bottom to top)
  const boxLayers = [
    // Bottom face
    { d: 'M100,200 L160,168 L220,200 L160,232 Z', fill: '#1A2E05', stroke: dimGreen },
    { d: 'M100,192 L160,160 L220,192 L160,224 Z', fill: '#1E3506', stroke: dimGreen },
    { d: 'M100,184 L160,152 L220,184 L160,216 Z', fill: '#233D07', stroke: dimGreen },
    { d: 'M100,176 L160,144 L220,176 L160,208 Z', fill: '#274508', stroke: dimGreen },
    { d: 'M100,168 L160,136 L220,168 L160,200 Z', fill: '#2B4D09', stroke: dimGreen },
    { d: 'M100,160 L160,128 L220,160 L160,192 Z', fill: '#30560A', stroke: dimGreen },
    { d: 'M100,152 L160,120 L220,152 L160,184 Z', fill: '#355E0B', stroke: '#6AAD2A' },
    { d: 'M100,144 L160,112 L220,144 L160,176 Z', fill: '#3A660C', stroke: '#7BC430' },
    // Top face
    { d: 'M100,144 L160,112 L220,144 L160,176 Z', fill: accentGreen, stroke: accentGreen, isTop: true },
    // Left face
    { d: 'M100,144 L100,200 L160,232 L160,176 Z', fill: '#1E2E00', stroke: dimGreen, isFace: true },
    // Right face
    { d: 'M160,176 L160,232 L220,200 L220,144 Z', fill: '#2A3D00', stroke: dimGreen, isFace: true },
  ];

  // Print nozzle path
  const nozzleY = 108;

  return (
    <div style={{ position: 'relative', width: 320, height: 320 }}>
      {/* Glow background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(168,230,61,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      <svg ref={svgRef} viewBox="0 0 320 320" width="320" height="320" xmlns="http://www.w3.org/2000/svg">
        {/* Grid lines for background */}
        {[0,1,2,3,4,5].map(i => (
          <line key={`h${i}`} x1="40" y1={80 + i * 40} x2="280" y2={80 + i * 40}
            stroke={border} strokeWidth="0.5" opacity="0.4" />
        ))}
        {[0,1,2,3,4,5].map(i => (
          <line key={`v${i}`} x1={40 + i * 48} y1="80" x2={40 + i * 48} y2="280"
            stroke={border} strokeWidth="0.5" opacity="0.4" />
        ))}

        {/* Print platform */}
        <ellipse cx="160" cy="240" rx="80" ry="16" fill="#141418" stroke={border} strokeWidth="1.5" />
        <ellipse cx="160" cy="236" rx="80" ry="16" fill="#1A1A20" stroke={border} strokeWidth="1" />

        {/* Box layers */}
        {boxLayers.map((layer, i) => (
          <path
            key={i}
            className="print-layer"
            d={layer.d}
            fill={layer.fill}
            stroke={layer.stroke}
            strokeWidth={layer.isTop ? 1.5 : 1}
            opacity="0"
            style={{ filter: layer.isTop ? `drop-shadow(0 0 6px ${accentGreen}50)` : 'none' }}
          />
        ))}

        {/* Print nozzle */}
        <g className="print-layer" opacity="0">
          {/* Nozzle body */}
          <rect x="148" y={nozzleY - 24} width="24" height="18" rx="3"
            fill="#2A2A35" stroke={border} strokeWidth="1.5" />
          {/* Nozzle tip */}
          <polygon points={`148,${nozzleY - 6} 172,${nozzleY - 6} 166,${nozzleY + 4} 154,${nozzleY + 4}`}
            fill="#1A1A25" stroke="#3A3A48" strokeWidth="1" />
          {/* Nozzle opening */}
          <line x1="157" y1={nozzleY + 4} x2="163" y2={nozzleY + 4}
            stroke={accentGreen} strokeWidth="2.5" strokeLinecap="round" />
          {/* Filament strand */}
          <line x1="160" y1={nozzleY + 4} x2="160" y2="120"
            stroke={accentGreen} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7" />
          {/* Heating glow */}
          <circle cx="160" cy={nozzleY - 2} r="4" fill={accentGreen} opacity="0.15" />
        </g>

        {/* Corner brackets for tech feel */}
        {[[40,80],[280,80],[40,280],[280,280]].map(([x,y], i) => {
          const dx = x < 160 ? 1 : -1;
          const dy = y < 160 ? 1 : -1;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + dx * 12} y2={y} stroke={accentGreen} strokeWidth="1.5" opacity="0.4" />
              <line x1={x} y1={y} x2={x} y2={y + dy * 12} stroke={accentGreen} strokeWidth="1.5" opacity="0.4" />
            </g>
          );
        })}

        {/* Spec labels */}
        <text x="46" y="76" fontFamily="Space Grotesk" fontSize="9" fill={accentGreen} opacity="0.5">P1S</text>
        <text x="246" y="76" fontFamily="Space Grotesk" fontSize="9" fill="var(--text-subtle)" opacity="0.6">256³mm</text>

        {/* Layer counter */}
        <text x="46" y="268" fontFamily="Space Grotesk" fontSize="9" fill="var(--text-subtle)" opacity="0.6">LAYER 8/8</text>
        <text x="220" y="268" fontFamily="Space Grotesk" fontSize="9" fill={accentGreen} opacity="0.7">100% ✓</text>
      </svg>
    </div>
  );
}
