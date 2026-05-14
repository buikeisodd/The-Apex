import { useState } from 'react';
import { Search } from 'lucide-react';
import BeatCard from '../components/BeatCard';
import CheckoutModal from '../components/CheckoutModal';
import { useApp } from '../context/AppContext';
import { genres } from '../data';

export default function BeatsPage() {
  const { beats, user, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [genre, setGenre]   = useState('All');
  const [sort, setSort]     = useState('popular');
  const [buyBeat, setBuyBeat] = useState(null);

  const filtered = beats
    .filter(b => b.status === 'active')
    .filter(b => genre === 'All' || b.genre === genre)
    .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.producer.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sort === 'popular' ? b.plays - a.plays : sort === 'price-asc' ? a.price - b.price : b.price - a.price);

  const handleBuyNow = (beat) => {
    if (!user) { showToast('Please sign in to purchase beats', 'error'); return; }
    setBuyBeat(beat);
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-raised)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '3.5rem 1.5rem 2.5rem' }}>
        <div className="container">
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Beat Store</span>
          <h1 className="font-display" style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '0.05em', lineHeight: 0.92, marginBottom: '0.875rem' }}>
            PREMIUM <span className="gold-text">BEATS</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{filtered.length} tracks available · Instant download after purchase</p>
        </div>
      </div>

      {/* Sticky filters */}
      <div style={{ background: 'rgba(6,6,8,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1rem 1.5rem', position: 'sticky', top: 68, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-dark" style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
              placeholder="Search beats, producers…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {genres.map(g => (
              <button key={g} onClick={() => setGenre(g)}
                style={{ padding: '7px 15px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s',
                  background: genre === g ? 'var(--gold)' : 'var(--surface2)',
                  color: genre === g ? '#000' : 'var(--text-muted)',
                  border: genre === g ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
                {g}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-dark"
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', width: 'auto', minWidth: 150, cursor: 'pointer' }}>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1.5rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>No beats found</p>
            <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(beat => <BeatCard key={beat.id} beat={beat} onBuyNow={handleBuyNow} />)}
          </div>
        )}
      </div>

      {buyBeat && <CheckoutModal beat={buyBeat} onClose={() => setBuyBeat(null)} />}
    </div>
  );
}
