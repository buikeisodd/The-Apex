import { useState } from 'react';
import { Search, User, Mail, Phone, MapPin, Music, Shield, Calendar, Eye, X, Ban, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function UserDetailModal({ user, onClose }) {
  const { bookings, beats, updateUserStatus, showToast } = useApp();
  const userBookings = bookings.filter(b => b.clientEmail === user.email);
  const userBeats    = beats.filter(b => b.producer === `${user.firstName} ${user.lastName}` || b.producer === user.lastName);

  const roleColor = { client: '#34C77B', producer: '#D4A843', admin: '#F04040' }[user.role] || 'var(--gold)';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="animate-scaleIn" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 540, maxHeight: '92vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${roleColor}88, ${roleColor}, ${roleColor}88)`, borderRadius: '18px 18px 0 0' }} />
        <div style={{ padding: '1.75rem 2rem 2rem' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={15} />
          </button>

          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${roleColor}44, ${roleColor}22)`, border: `2px solid ${roleColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: roleColor, flexShrink: 0 }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.firstName} {user.lastName}</h2>
                <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 10, background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}35`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{user.role}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>@{user.username || user.email.split('@')[0]}</p>
              <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: user.status === 'active' ? 'rgba(52,199,123,0.12)' : 'rgba(240,64,64,0.12)', color: user.status === 'active' ? '#34C77B' : '#F04040', border: `1px solid ${user.status === 'active' ? 'rgba(52,199,123,0.25)' : 'rgba(240,64,64,0.25)'}` }}>
                {user.status}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Profile Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {[
                { icon: <Mail size={13} />,     label: 'Email',    value: user.email },
                { icon: <Phone size={13} />,    label: 'Phone',    value: user.phone || '—' },
                { icon: <MapPin size={13} />,   label: 'Location', value: user.city && user.country ? `${user.city}, ${user.country}` : '—' },
                { icon: <Calendar size={13} />, label: 'Joined',   value: new Date(user.joinedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { icon: <Shield size={13} />,   label: 'Provider', value: user.provider || 'Email' },
                ...(user.role === 'producer' ? [{ icon: <Music size={13} />, label: 'Genre', value: user.genre || '—' }] : []),
                ...(user.dob ? [{ icon: <User size={13} />, label: 'Date of Birth', value: user.dob }] : []),
              ].map(({ icon, label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{icon}{label}</p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, wordBreak: 'break-word' }}>{value}</p>
                </div>
              ))}
            </div>
            {user.bio && (
              <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bio</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic' }}>"{user.bio}"</p>
              </div>
            )}
          </div>

          {/* Activity */}
          {user.role === 'client' && userBookings.length > 0 && (
            <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>Booking History ({userBookings.length})</p>
              {userBookings.slice(0, 3).map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{b.sessionType}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{b.date} · {b.time}</p>
                  </div>
                  <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 4, background: b.status === 'confirmed' ? 'rgba(52,199,123,0.1)' : 'rgba(212,168,67,0.1)', color: b.status === 'confirmed' ? '#34C77B' : 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>{b.status}</span>
                </div>
              ))}
            </div>
          )}

          {user.role === 'producer' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Beats', value: userBeats.length },
                { label: 'Sessions', value: bookings.filter(b => b.assignedProducer === `${user.firstName} ${user.lastName}` || b.assignedProducer === user.lastName).length },
                { label: 'Revenue', value: `$${(bookings.filter(b => (b.assignedProducer === `${user.firstName} ${user.lastName}` || b.assignedProducer === user.lastName) && b.status === 'completed').reduce((s, b) => s + b.price * 0.6, 0)).toFixed(0)}` },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: '0.875rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: 'var(--gold)', letterSpacing: '0.04em' }}>{s.value}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            {user.status === 'active' ? (
              <button onClick={() => { updateUserStatus(user.id, 'suspended'); onClose(); }} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(240,64,64,0.1)', border: '1px solid rgba(240,64,64,0.25)', color: '#F04040', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                <Ban size={14} /> Suspend Account
              </button>
            ) : (
              <button onClick={() => { updateUserStatus(user.id, 'active'); onClose(); }} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(52,199,123,0.1)', border: '1px solid rgba(52,199,123,0.25)', color: '#34C77B', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                <CheckCircle size={14} /> Reactivate Account
              </button>
            )}
            <button onClick={onClose} className="btn-outline" style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { users } = useApp();
  const [filter,   setFilter]   = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [search,   setSearch]   = useState('');
  const [viewing,  setViewing]  = useState(null);

  const filtered = users
    .filter(u => filter === 'all' || u.status === filter)
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .filter(u => {
      const q = search.toLowerCase();
      return u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.country || '').toLowerCase().includes(q);
    });

  const clients   = users.filter(u => u.role === 'client');
  const producers = users.filter(u => u.role === 'producer');
  const suspended = users.filter(u => u.status === 'suspended');

  const roleColors = { client: '#34C77B', producer: '#D4A843', admin: '#F04040' };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-raised)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '3rem 1.5rem 2.25rem' }}>
        <div className="container">
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex', color: '#F04040' }}>Admin · Users</span>
          <h1 className="font-display" style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em', lineHeight: 0.92, marginBottom: '1.25rem' }}>
            USER <span className="gold-text">MANAGEMENT</span>
          </h1>
          {/* KPI row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Users', value: users.length, color: 'var(--gold)' },
              { label: 'Clients',     value: clients.length, color: '#34C77B' },
              { label: 'Producers',   value: producers.length, color: '#D4A843' },
              { label: 'Suspended',   value: suspended.length, color: '#F04040' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem', border: '1px solid rgba(255,255,255,0.06)', minWidth: 110, textAlign: 'center' }}>
                <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: s.color, letterSpacing: '0.04em', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-dark" style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }} placeholder="Search name, email, country…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {[['all', 'All Roles'], ['client', 'Clients'], ['producer', 'Producers']].map(([v, l]) => (
              <button key={v} onClick={() => setRoleFilter(v)} style={{ padding: '7px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: roleFilter === v ? 'var(--gold)' : 'var(--surface2)', color: roleFilter === v ? '#000' : 'var(--text-muted)', border: roleFilter === v ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {[['all', 'All Status'], ['active', 'Active'], ['suspended', 'Suspended']].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{ padding: '7px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: filter === v ? (v === 'suspended' ? '#F04040' : 'var(--gold)') : 'var(--surface2)', color: filter === v ? '#000' : 'var(--text-muted)', border: filter === v ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(u => {
            const rc = roleColors[u.role] || 'var(--gold)';
            return (
              <div key={u.id} className="card" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setViewing(u)}>
                {/* Role colour top strip */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${rc}55, ${rc}, ${rc}55)` }} />
                <div style={{ padding: '1.25rem' }}>
                  {/* Avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${rc}33, ${rc}11)`, border: `1.5px solid ${rc}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: rc, flexShrink: 0 }}>
                      {u.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.firstName} {u.lastName}</p>
                        {u.status === 'suspended' && <span style={{ fontSize: '0.55rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(240,64,64,0.15)', color: '#F04040', border: '1px solid rgba(240,64,64,0.25)', fontWeight: 700, flexShrink: 0 }}>SUSPENDED</span>}
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                    </div>
                  </div>

                  {/* Info chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 10, background: `${rc}18`, color: rc, border: `1px solid ${rc}30`, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{u.role}</span>
                    {u.country && <span className="tag">{u.country}</span>}
                    {u.genre && <span className="tag">{u.genre}</span>}
                    {u.provider && <span style={{ fontSize: '0.6rem', padding: '2px 7px', borderRadius: 10, background: 'var(--surface3)', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{u.provider}</span>}
                  </div>

                  {/* Bottom row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>
                      Joined {new Date(u.joinedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </p>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.18s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; e.currentTarget.style.color = 'var(--gold)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                      <Eye size={12} /> View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <User size={40} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>

      {viewing && <UserDetailModal user={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
