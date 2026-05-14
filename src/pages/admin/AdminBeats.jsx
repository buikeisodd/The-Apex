import { useState } from 'react';
import { Trash2, CheckCircle, Play, Pause, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminBeats() {
  const { beats, deleteBeat, approveBeat } = useApp();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [playing, setPlaying] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = beats
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.producer.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id) => { deleteBeat(id); setConfirmDelete(null); };

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '2.5rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '0.75rem', display: 'inline-block', background: 'rgba(224,60,60,0.15)', color: '#e03c3c', borderColor: 'rgba(224,60,60,0.3)' }}>Admin · Beats</span>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em' }}>
            BEAT <span className="gold-text">MANAGEMENT</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Review, approve, and remove beats from the store.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-dark rounded-lg text-sm" style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} placeholder="Search beats or producers…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {['all', 'active', 'pending'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '6px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                background: filter === s ? 'var(--gold)' : 'var(--surface2)',
                color: filter === s ? 'var(--black)' : 'var(--text-muted)',
                border: filter === s ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span style={{ marginLeft: 6, opacity: 0.7 }}>({beats.filter(b => s === 'all' ? true : b.status === s).length})</span>
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', maxWidth: 500 }}>
          {[{ label: 'Total', val: beats.length, c: 'var(--gold)' }, { label: 'Active', val: beats.filter(b=>b.status==='active').length, c: '#22c55e' }, { label: 'Pending Review', val: beats.filter(b=>b.status==='pending').length, c: '#eab308' }].map(s => (
            <div key={s.label} className="card rounded-xl p-4 text-center">
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: s.c, letterSpacing: '0.05em' }}>{s.val}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(beat => (
            <div key={beat.id} className="card rounded-2xl overflow-hidden">
              {/* Cover */}
              <div style={{ height: 120, background: `linear-gradient(135deg, hsl(${beat.id * 47}, 40%, 10%), hsl(${beat.id * 47 + 60}, 30%, 6%))`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button onClick={() => setPlaying(playing === beat.id ? null : beat.id)}
                  style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(201,168,76,0.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {playing === beat.id ? <Pause size={16} style={{ color: 'var(--black)' }} /> : <Play size={16} style={{ color: 'var(--black)', marginLeft: 2 }} />}
                </button>
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <span className="tag">{beat.genre}</span>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <span style={{ fontSize: '0.62rem', padding: '2px 7px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                    background: beat.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
                    color: beat.status === 'active' ? '#22c55e' : '#eab308',
                    border: `1px solid ${beat.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}` }}>
                    {beat.status}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{beat.title}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{beat.producer}</p>
                  </div>
                  <p style={{ color: 'var(--gold)', fontFamily: 'Bebas Neue', fontSize: '1.2rem' }}>${beat.price}</p>
                </div>
                <div style={{ display: 'flex', gap: 4, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="tag">{beat.bpm} BPM</span>
                  <span className="tag">{beat.key}</span>
                  <span style={{ fontFamily: 'DM Mono', fontSize: '0.62rem', color: 'var(--text-muted)' }}>{beat.plays.toLocaleString()} plays</span>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {beat.status === 'pending' && (
                    <button onClick={() => approveBeat(beat.id)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '7px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                      <CheckCircle size={13} /> Approve
                    </button>
                  )}
                  <button onClick={() => setConfirmDelete(beat)}
                    style={{ flex: beat.status === 'pending' ? 0 : 1, padding: '7px 12px', borderRadius: 8, background: 'rgba(224,60,60,0.1)', border: '1px solid rgba(224,60,60,0.25)', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.75rem' }}>
                    <Trash2 size={13} /> {beat.status !== 'pending' ? 'Delete' : ''}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No beats found</div>
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="card rounded-2xl p-7 w-full max-w-sm animate-fadeUp" style={{ background: 'var(--surface)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>DELETE BEAT?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              This will permanently remove <strong style={{ color: 'var(--text)' }}>{confirmDelete.title}</strong> by {confirmDelete.producer} from the store. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setConfirmDelete(null)} className="btn-outline flex-1 py-3 rounded-xl text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.id)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 12, background: 'var(--red)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
