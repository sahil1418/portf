import { ImageResponse } from 'next/og';

export const alt = 'Sahil Kumar — ML Researcher & Full Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Fixed pseudo-random constellation so the preview is identical on every build.
const nodes = Array.from({ length: 46 }, (_, i) => {
  const angle = i * 2.399963;
  const radius = 40 + Math.sqrt(i / 46) * 230;
  return { x: 900 + Math.cos(angle) * radius, y: 315 + Math.sin(angle) * radius * 0.92, r: 2 + (i % 4) };
});

const edges = nodes.flatMap((node, i) =>
  nodes
    .slice(i + 1)
    .filter((other) => Math.hypot(other.x - node.x, other.y - node.y) < 95)
    .map((other) => [node, other] as const),
);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'radial-gradient(circle at 75% 50%, #1d1258 0%, #07041f 45%, #030014 100%)',
          color: '#f0eef5',
          fontFamily: 'sans-serif',
        }}
      >
        <svg width="1200" height="630" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <radialGradient id="core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7c5cff" />
              <stop offset="60%" stopColor="#2b2a9e" />
              <stop offset="100%" stopColor="#120c40" />
            </radialGradient>
          </defs>
          <ellipse cx="900" cy="315" rx="290" ry="90" fill="none" stroke="#22e6ff" strokeOpacity="0.45" transform="rotate(-18 900 315)" />
          <ellipse cx="900" cy="315" rx="300" ry="110" fill="none" stroke="#a78bfa" strokeOpacity="0.4" transform="rotate(28 900 315)" />
          {edges.map(([a, b], i) => (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={i % 3 ? '#22e6ff' : '#a855f7'} strokeOpacity="0.35" strokeWidth="1.2" />
          ))}
          <circle cx="900" cy="315" r="95" fill="url(#core)" />
          {nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={i % 5 ? '#9eeaff' : '#f472b6'} />
          ))}
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 72px', width: 820 }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '8px 18px',
              borderRadius: 999,
              border: '1px solid rgba(34,230,255,0.4)',
              background: 'rgba(34,230,255,0.08)',
              color: '#7aecff',
              fontSize: 20,
              letterSpacing: 2,
            }}
          >
            IIIT ALLAHABAD · B.TECH ECE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 28, fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>
            <span style={{ color: '#f0eef5' }}>Sahil</span>
            <span style={{ backgroundImage: 'linear-gradient(90deg, #27ddff, #8b5cf6 60%, #c34bff)', backgroundClip: 'text', color: 'transparent' }}>
              Kumar
            </span>
          </div>
          <div style={{ marginTop: 22, fontSize: 32, color: '#b4b0c4' }}>ML Researcher · Full Stack Developer</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
            {['2× IEEE · ICDM & MIGARS', 'Top 5 Teams · Hero ML', 'Top 50 · Amazon ML'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  padding: '12px 20px',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(12,10,40,0.92)',
                  fontSize: 21,
                  color: '#f0eef5',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
