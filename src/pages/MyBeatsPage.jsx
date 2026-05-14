import { useState } from 'react';
import { Play, Pause, Edit3, Trash2, Eye, TrendingUp } from 'lucide-react';
import { beats } from '../data';

const myBeats = beats.map(b => ({
  ...b,
  sales: Math.floor(Math.random() * 25) + 1,
  revenue: ((Math.floor(Math.random() * 25) + 1) * b.price).toFixed(2),
  status: Math.random() > 0.2 ? 'active' : 'pending',
}));

export default function MyBeatsPage() {
  const [playing, setPlaying] = useState(null);

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>Producer Portal</span>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '0.05em' }}>
            MY <span className="gold-text">BEATS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{myBeats.length} beats · {myBeats.filter(b => b.status === 'active').length} active</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {myBeats.map(beat => (
            <div key={beat.id} className="card rounded-2xl overflow-hidden">
              {/* Cover */}
              <div style={{ position: 'relative', height: 140, background: `linear-gradient(135deg, hsl(${beat.id * 47}, 40%, 12%), hsl(${beat.id * 47 + 60}, 30%, 8%))` }}>
                <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                  <span className="tag">{beat.genre}</span>
                  <span className={`tag`} style={{ background: beat.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)', color: beat.status === 'active' ? '#22c55e' : '#eab308', borderColor: beat.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)' }}>
                    {beat.status}
                  </span>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button onClick={() => setPlaying(playing === beat.id ? null : beat.id)}
                    style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(201,168,76,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {playing === beat.id ? <Pause size={18} style={{ color: 'var(--black)' }} /> : <Play size={18} style={{ color: 'var(--black)', marginLeft: 2 }} />}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: 2 }}>{beat.title}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{beat.bpm} BPM · {beat.key}</p>
                  </div>
                  <p style={{ color: 'var(--gold)', fontFamily: 'Bebas Neue', fontSize: '1.2rem' }}>${beat.price}</p>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { icon: <Eye size={12} />, val: beat.plays.toLocaleString(), label: 'plays' },
                    { icon: <TrendingUp size={12} />, val: beat.sales, label: 'sales' },
                    { icon: <span style={{ fontFamily: 'DM Mono', fontSize: '0.6rem' }}>$</span>, val: beat.revenue, label: 'earned' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '0.4rem 0.5rem', textAlign: 'center' }}>
                      <div style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>{s.icon}</div>
                      <p style={{ fontFamily: 'DM Mono', fontSize: '0.75rem', fontWeight: 600 }}>{s.val}</p>
                      <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-outline flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1">
                    <Edit3 size={12} /> Edit
                  </button>
                  <button style={{ background: 'rgba(224,60,60,0.1)', border: '1px solid rgba(224,60,60,0.25)', color: '#e03c3c', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
