import { useState } from 'react';
import { Search, Music, MapPin, Star, Play, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

function AvatarDisplay({ u, size = 48 }) {
  const isEmoji = u?.avatarType === 'emoji';
  const isImage = u?.avatarType === 'image';
  const color   = u?.avatarColor || '#D4A843';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: isImage ? 'transparent' : `linear-gradient(135deg, ${color}44, ${color}18)`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
      {isImage
        ? <img src={u.avatarValue} alt="av" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontSize: isEmoji ? size * 0.44 : size * 0.38, fontWeight: isEmoji ? 400 : 800, color, lineHeight: 1 }}>{u?.avatarValue || u?.firstName?.[0] || '?'}</span>
      }
    </div>
  );
}

function UserCard({ u, beats, bookings }) {
  const isProducer = u.role === 'producer';
  const myBeats    = beats.filter(b => b.producer === `${u.firstName} ${u.lastName}`);
  const mySessions = bookings.filter(b => b.assignedProducer === `${u.firstName} ${u.lastName}`);
  const rc         = u.avatarColor || '#D4A843';

  return (
    <div className="card" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all 0.28s var(--ease-out)' }}>
      {/* Header strip */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${rc}55, ${rc}, ${rc}55)` }} />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <AvatarDisplay u={u} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.firstName} {u.lastName}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Mono', marginBottom: '0.3rem' }}>@{u.username || u.email?.split('@')[0]}</p>
            {isProducer && u.genre && <span className="tag">{u.genre}</span>}
          </div>
        </div>

        {u.bio && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>{u.bio}</p>}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {u.city && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} />{u.city}</span>}
          {u.country && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>· {u.country}</span>}
        </div>

        {isProducer && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '0.5rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', color: 'var(--gold)' }}>{myBeats.length}</p>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Beats</p>
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '0.5rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', color: 'var(--gold)' }}>{mySessions.length}</p>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sessions</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ flex: 1, fontSize: '0.65rem', padding: '5px 10px', borderRadius: 8, background: `${rc}12`, color: rc, border: `1px solid ${rc}25`, textAlign: 'center', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {u.provider || 'Email'} User
          </span>
          <span style={{ fontSize: '0.65rem', padding: '5px 10px', borderRadius: 8, background: u.status === 'active' ? 'rgba(52,199,123,0.1)' : 'rgba(240,64,64,0.1)', color: u.status === 'active' ? '#34C77B' : '#F04040', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {u.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const { users, beats, bookings, user } = useApp();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');

  const isProducer = user?.role === 'producer';
  // Producers see clients, clients see producers
  const targetRole = isProducer ? 'client' : 'producer';
  const targets    = users.filter(u => u.role === targetRole && u.status === 'active');

  const countries  = ['All', ...new Set(targets.map(u => u.country).filter(Boolean))];

  const filtered = targets
    .filter(u => country === 'All' || u.country === country)
    .filter(u => {
      const q = search.toLowerCase();
      return `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || (u.bio || '').toLowerCase().includes(q) || (u.genre || '').toLowerCase().includes(q) || (u.city || '').toLowerCase().includes(q);
    });

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-raised)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '3rem 1.5rem 2.25rem' }}>
        <div className="container">
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Explore</span>
          <h1 className="font-display" style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em', lineHeight: 0.92, marginBottom: '0.5rem' }}>
            {isProducer ? 'EXPLORE ' : 'DISCOVER '}<span className="gold-text">{isProducer ? 'CLIENTS' : 'PRODUCERS'}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {isProducer ? `${filtered.length} registered artists on the platform` : `${filtered.length} producers available`}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-dark" style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
              placeholder={isProducer ? 'Search artists by name, genre, city…' : 'Search producers by name, genre, city…'}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {countries.map(c => (
              <button key={c} onClick={() => setCountry(c)}
                style={{ padding: '7px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: country === c ? 'var(--gold)' : 'var(--surface2)', color: country === c ? '#000' : 'var(--text-muted)', border: country === c ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
            <p style={{ fontSize: '1rem', color: 'var(--text)' }}>No users found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filtered.map(u => <UserCard key={u.id} u={u} beats={beats} bookings={bookings} />)}
          </div>
        )}
      </div>
    </div>
  );
}
