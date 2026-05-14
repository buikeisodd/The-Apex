import { useApp } from '../../context/AppContext';

export default function AdminProducers() {
  const { PRODUCERS, bookings, beats, notifications } = useApp();

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '2.5rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '0.75rem', display: 'inline-block', background: 'rgba(224,60,60,0.15)', color: '#e03c3c', borderColor: 'rgba(224,60,60,0.3)' }}>Admin · Producers</span>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em' }}>
            PRODUCER <span className="gold-text">OVERVIEW</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {PRODUCERS.map((p, idx) => {
            const myBeats    = beats.filter(b => b.producer === p);
            const mySessions = bookings.filter(b => b.assignedProducer === p);
            const myNotifs   = notifications[p] || [];
            const unread     = myNotifs.filter(n => !n.read).length;
            const revenue    = mySessions.filter(b => b.status === 'completed').reduce((s,b) => s + b.price * 0.6, 0);
            const colors     = ['var(--gold)', '#22c55e', '#8b5cf6'];

            return (
              <div key={p} className="card rounded-2xl overflow-hidden">
                <div style={{ height: 80, background: `linear-gradient(135deg, ${colors[idx]}20, ${colors[idx]}08)`, borderBottom: `2px solid ${colors[idx]}30`, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: colors[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', color: '#000', flexShrink: 0 }}>
                    {p[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem' }}>{p}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active Producer</p>
                  </div>
                  {unread > 0 && (
                    <div style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>{unread}</div>
                  )}
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {[{ label: 'Beats', val: myBeats.length }, { label: 'Sessions', val: mySessions.length }, { label: 'Earned', val: `$${revenue.toFixed(0)}` }].map(s => (
                      <div key={s.label} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '0.6rem', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', color: colors[idx], letterSpacing: '0.05em' }}>{s.val}</p>
                        <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Assigned sessions */}
                  {mySessions.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Assigned Sessions</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {mySessions.slice(0, 3).map(s => (
                          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', background: 'var(--surface2)', borderRadius: 6, fontSize: '0.75rem' }}>
                            <span>{s.clientName} · {s.sessionType}</span>
                            <span style={{ color: colors[idx], fontFamily: 'DM Mono' }}>{s.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notifications */}
                  {myNotifs.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Recent Notifications</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {myNotifs.slice(0, 2).map(n => (
                          <div key={n.id} style={{ padding: '0.5rem 0.6rem', background: n.read ? 'var(--surface2)' : 'rgba(201,168,76,0.08)', borderRadius: 6, border: n.read ? 'none' : '1px solid rgba(201,168,76,0.2)', fontSize: '0.72rem', color: n.read ? 'var(--text-muted)' : 'var(--text)', lineHeight: 1.5 }}>
                            {n.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
