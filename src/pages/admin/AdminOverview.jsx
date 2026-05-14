import { Calendar, Music, DollarSign, Users, TrendingUp, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminOverview({ setActivePage }) {
  const { bookings, beats } = useApp();

  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0);
  const pending      = bookings.filter(b => b.status === 'pending').length;
  const confirmed    = bookings.filter(b => b.status === 'confirmed').length;
  const activeBeats  = beats.filter(b => b.status === 'active').length;
  const pendingBeats = beats.filter(b => b.status === 'pending').length;

  const stats = [
    { icon: <Calendar size={22} />, label: 'Total Bookings',    value: bookings.length,        change: `${pending} pending` },
    { icon: <Music size={22} />,    label: 'Total Beats',       value: beats.length,            change: `${pendingBeats} awaiting review` },
    { icon: <DollarSign size={22}/>,label: 'Revenue (Completed)',value: `$${totalRevenue}`,     change: `${confirmed} confirmed sessions` },
    { icon: <Users size={22} />,    label: 'Active Beats',      value: activeBeats,             change: 'live in store' },
  ];

  const recentBookings = [...bookings].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const statusColor = { pending: '#eab308', confirmed: '#22c55e', completed: 'var(--gold)', cancelled: 'var(--red)' };
  const statusBg    = { pending: 'rgba(234,179,8,0.1)', confirmed: 'rgba(34,197,94,0.1)', completed: 'rgba(201,168,76,0.1)', cancelled: 'rgba(224,60,60,0.1)' };

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '2.5rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '0.75rem', display: 'inline-block', background: 'rgba(224,60,60,0.15)', color: '#e03c3c', borderColor: 'rgba(224,60,60,0.3)' }}>Admin Portal</span>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em' }}>
            COMMAND <span className="gold-text">CENTRE</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Full oversight of all label operations.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {stats.map(s => (
            <div key={s.label} className="card rounded-2xl p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>{s.icon}</div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '2.2rem', letterSpacing: '0.05em', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--gold)', fontFamily: 'DM Mono' }}>{s.change}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }} className="overview-grid">
          {/* Recent bookings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: '0.1em' }}>RECENT BOOKINGS</h2>
              <button onClick={() => setActivePage('admin-bookings')} className="btn-outline px-4 py-2 rounded-lg text-xs">View All</button>
            </div>
            <div className="card rounded-2xl overflow-hidden">
              {recentBookings.map((b, i) => (
                <div key={b.id} style={{ padding: '1rem 1.25rem', borderBottom: i < recentBookings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: statusBg[b.status], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={16} style={{ color: statusColor[b.status] }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>{b.clientName}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.sessionType} · {b.date} {b.time}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: 4, background: statusBg[b.status], color: statusColor[b.status], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{b.status}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gold)', fontFamily: 'DM Mono', marginTop: 4 }}>${b.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>QUICK ACTIONS</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Manage Bookings', desc: `${pending} sessions need assignment`, page: 'admin-bookings', accent: '#eab308' },
                { label: 'Review Beats', desc: `${pendingBeats} beats awaiting approval`, page: 'admin-beats', accent: 'var(--gold)' },
                { label: 'Producer Overview', desc: 'View all producer activity', page: 'admin-producers', accent: '#22c55e' },
              ].map(a => (
                <button key={a.label} onClick={() => setActivePage(a.page)}
                  className="card rounded-xl p-4 text-left w-full"
                  style={{ cursor: 'pointer', background: 'var(--surface)', border: `1px solid ${a.accent}30` }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: a.accent }}>{a.label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .overview-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
