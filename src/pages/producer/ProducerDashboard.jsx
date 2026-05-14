import { TrendingUp, Music, DollarSign, Play, Upload, Bell, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProducerDashboard({ setActivePage }) {
  const { user, beats, bookings, notifications } = useApp();
  const myBeats    = beats.filter(b => b.producer === user?.name).slice(0, 4);
  const mySessions = bookings.filter(b => b.assignedProducer === user?.name);
  const myNotifs   = notifications[user?.name] || [];
  const unread     = myNotifs.filter(n => !n.read).length;

  const totalRevenue = mySessions.filter(b => b.status === 'completed').reduce((s,b) => s + b.price * 0.6, 0).toFixed(2);
  const totalPlays   = myBeats.reduce((s,b) => s + b.plays, 0);

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '2.5rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="tag" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Producer Portal</span>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em' }}>
              WELCOME, <span className="gold-text">{user?.name?.split(' ')[0]?.toUpperCase() || 'PRODUCER'}</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {unread > 0 && (
              <button onClick={() => setActivePage('notifications')} className="btn-outline px-4 py-3 rounded-xl text-sm flex items-center gap-2" style={{ position: 'relative' }}>
                <Bell size={15} /> Notifications
                <span style={{ background: 'var(--red)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>{unread}</span>
              </button>
            )}
            <button onClick={() => setActivePage('upload')} className="btn-gold px-5 py-3 rounded-xl text-sm flex items-center gap-2">
              <Upload size={15} /> Upload Beat
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {[
            { icon: <DollarSign size={20}/>, label: 'Revenue (60%)', value: `$${totalRevenue}` },
            { icon: <Music size={20}/>,      label: 'Beats Listed',  value: myBeats.length },
            { icon: <Calendar size={20}/>,   label: 'Assigned Sessions', value: mySessions.length },
            { icon: <Play size={20}/>,       label: 'Total Plays',   value: totalPlays.toLocaleString() },
          ].map(s => (
            <div key={s.label} className="card rounded-2xl p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>{s.icon}</div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.05em' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Assigned sessions */}
        {mySessions.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>MY ASSIGNED SESSIONS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {mySessions.map(s => (
                <div key={s.id} className="card rounded-xl p-5" style={{ borderColor: s.status === 'confirmed' ? 'rgba(34,197,94,0.3)' : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 4, background: s.status === 'confirmed' ? 'rgba(34,197,94,0.1)' : 'rgba(201,168,76,0.1)', color: s.status === 'confirmed' ? '#22c55e' : 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>{s.status}</span>
                    <span style={{ color: 'var(--gold)', fontFamily: 'Bebas Neue', fontSize: '1.1rem' }}>${s.price}</span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{s.sessionType}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Client: {s.clientName}</p>
                  <p style={{ fontFamily: 'DM Mono', fontSize: '0.72rem', color: 'var(--gold)' }}>{s.date} at {s.time} · {s.duration}</p>
                  {s.notes && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>"{s.notes}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My beats table */}
        {myBeats.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: '0.1em' }}>MY BEATS</h2>
              <button onClick={() => setActivePage('mybeats')} className="btn-outline px-4 py-2 rounded-lg text-xs">View All</button>
            </div>
            <div className="card rounded-2xl overflow-hidden">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                      {['Beat', 'Genre', 'BPM', 'Price', 'Plays', 'Status'].map(h => (
                        <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myBeats.map((b, i) => (
                      <tr key={b.id} style={{ borderBottom: i < myBeats.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 7, background: `linear-gradient(135deg, hsl(${b.id*47},40%,14%), hsl(${b.id*47+60},30%,9%))`, flexShrink: 0 }} />
                            <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{b.title}</p>
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}><span className="tag">{b.genre}</span></td>
                        <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.bpm}</td>
                        <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono', fontSize: '0.85rem', color: 'var(--gold)' }}>${b.price}</td>
                        <td style={{ padding: '0.875rem 1rem', fontFamily: 'DM Mono', fontSize: '0.8rem' }}>{b.plays.toLocaleString()}</td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span style={{ fontSize: '0.63rem', padding: '2px 7px', borderRadius: 4, background: b.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(234,179,8,0.12)', color: b.status === 'active' ? '#22c55e' : '#eab308', fontWeight: 700, textTransform: 'uppercase' }}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
