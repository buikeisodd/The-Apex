import { TrendingUp, Music, DollarSign, Play, Upload, Eye } from 'lucide-react';
import { beats } from '../data';
import { useApp } from '../context/AppContext';

const myBeats = beats.slice(0, 4).map(b => ({ ...b, sales: Math.floor(Math.random() * 20) + 1, revenue: (Math.floor(Math.random() * 20) + 1) * b.price }));

export default function DashboardPage({ setActivePage }) {
  const { user } = useApp();

  const totalRevenue = myBeats.reduce((s, b) => s + b.revenue, 0).toFixed(2);
  const totalSales = myBeats.reduce((s, b) => s + b.sales, 0);
  const totalPlays = myBeats.reduce((s, b) => s + b.plays, 0);

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '2.5rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="tag" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Producer Portal</span>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em' }}>
              WELCOME BACK, <span className="gold-text">{user?.name?.split(' ')[0]?.toUpperCase() || 'PRODUCER'}</span>
            </h1>
          </div>
          <button onClick={() => setActivePage('upload')} className="btn-gold px-6 py-3 rounded-xl text-sm flex items-center gap-2">
            <Upload size={15} /> Upload Beat
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {[
            { icon: <DollarSign size={20} />, label: 'Total Revenue', value: `$${totalRevenue}`, change: '+18%' },
            { icon: <Music size={20} />, label: 'Beats Listed', value: myBeats.length, change: '+2 this month' },
            { icon: <TrendingUp size={20} />, label: 'Total Sales', value: totalSales, change: '+5 this week' },
            { icon: <Play size={20} />, label: 'Total Plays', value: totalPlays.toLocaleString(), change: '+1.2K' },
          ].map(s => (
            <div key={s.label} className="card rounded-2xl p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.05em', color: 'var(--text)', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--gold)', fontFamily: 'DM Mono' }}>{s.change} this month</p>
            </div>
          ))}
        </div>

        {/* My Beats table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: '0.1em' }}>MY BEATS</h2>
            <button onClick={() => setActivePage('mybeats')} className="btn-outline px-4 py-2 rounded-lg text-xs">View All</button>
          </div>
          <div className="card rounded-2xl overflow-hidden">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                    {['Beat', 'Genre', 'BPM', 'Price', 'Plays', 'Sales', 'Revenue', ''].map(h => (
                      <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myBeats.map((b, i) => (
                    <tr key={b.id} style={{ borderBottom: i < myBeats.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, hsl(${b.id * 47}, 40%, 15%), hsl(${b.id * 47 + 60}, 30%, 10%))`, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{b.title}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{b.producer}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}><span className="tag">{b.genre}</span></td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.bpm}</td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono', fontSize: '0.85rem', color: 'var(--gold)' }}>${b.price}</td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono', fontSize: '0.8rem' }}>{b.plays.toLocaleString()}</td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono', fontSize: '0.85rem' }}>{b.sales}</td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono', fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>${b.revenue.toFixed(0)}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActivePage('upload')} className="btn-gold px-6 py-3 rounded-xl text-sm flex items-center gap-2">
            <Upload size={15} /> Upload New Beat
          </button>
        </div>
      </div>
    </div>
  );
}
