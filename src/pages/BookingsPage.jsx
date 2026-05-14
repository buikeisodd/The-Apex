import { useState } from 'react';
import {
  Calendar, Clock, User, Search, Filter,
  CheckCircle, XCircle, AlertCircle, ChevronDown,
  MessageSquare, DollarSign, Eye, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#eab308', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.3)',   icon: <AlertCircle size={13}/> },
  confirmed: { label: 'Confirmed', color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   icon: <CheckCircle size={13}/> },
  completed: { label: 'Completed', color: '#C9A84C', bg: 'rgba(201,168,76,0.12)',  border: 'rgba(201,168,76,0.3)',  icon: <CheckCircle size={13}/> },
  cancelled: { label: 'Cancelled', color: '#e03c3c', bg: 'rgba(224,60,60,0.12)',   border: 'rgba(224,60,60,0.3)',   icon: <XCircle size={13}/>  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      letterSpacing: '0.06em', textTransform: 'uppercase',
    }}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function DetailModal({ booking, onClose, onStatusChange }) {
  const [status, setStatus] = useState(booking.status);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => { onStatusChange(booking.id, status); setSaving(false); onClose(); }, 700);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card rounded-2xl animate-fadeUp" style={{ background: 'var(--surface)', width: '100%', maxWidth: 520, position: 'relative', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} style={{ color: 'var(--gold)' }}/>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: '0.08em' }}>BOOKING DETAIL</h2>
            <p style={{ fontFamily: 'DM Mono', fontSize: '0.7rem', color: 'var(--gold)' }}>{booking.id.toUpperCase()}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {[
            ['Client',    booking.clientName],
            ['Email',     booking.clientEmail],
            ['Session',   booking.sessionType],
            ['Duration',  booking.duration],
            ['Date',      booking.date],
            ['Time',      booking.time],
            ['Price',     `$${booking.price}`],
            ['Booked At', new Date(booking.createdAt).toLocaleString()],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontWeight: 600, maxWidth: 260, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        {booking.notes && (
          <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '0.875rem', marginBottom: '1.5rem', borderLeft: '3px solid var(--gold)' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Client Notes</p>
            <p style={{ fontSize: '0.83rem', lineHeight: 1.6 }}>{booking.notes}</p>
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Update Status</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
              <button key={val} onClick={() => setStatus(val)}
                style={{ padding: '6px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', border: `1px solid ${status === val ? cfg.color : 'rgba(255,255,255,0.08)'}`, background: status === val ? cfg.bg : 'transparent', color: status === val ? cfg.color : 'var(--text-muted)' }}>
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={save} disabled={saving} className="btn-gold flex-1 py-3 rounded-xl text-sm">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="btn-outline py-3 px-5 rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const { bookings, updateBookingStatus } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [sortDir, setSortDir] = useState('desc');

  const sessionTypes = ['all', ...new Set(bookings.map(b => b.sessionType))];

  const filtered = bookings
    .filter(b => statusFilter === 'all' || b.status === statusFilter)
    .filter(b => sessionFilter === 'all' || b.sessionType === sessionFilter)
    .filter(b => {
      const q = search.toLowerCase();
      return !q || b.clientName.toLowerCase().includes(q) || b.clientEmail.toLowerCase().includes(q) || b.sessionType.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    })
    .sort((a, b) => sortDir === 'desc'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue:   bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.price, 0),
  };

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>Producer Portal</span>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '0.05em' }}>
            STUDIO <span className="gold-text">BOOKINGS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            All incoming session requests — review, confirm, or reschedule.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: <Calendar size={18}/>, label: 'Total Bookings',  value: stats.total,                  color: 'var(--gold)' },
            { icon: <AlertCircle size={18}/>, label: 'Pending',      value: stats.pending,                color: '#eab308' },
            { icon: <CheckCircle size={18}/>, label: 'Confirmed',    value: stats.confirmed,              color: '#22c55e' },
            { icon: <DollarSign size={18}/>, label: 'Total Revenue',  value: `$${stats.revenue}`,         color: 'var(--gold)' },
          ].map(s => (
            <div key={s.label} className="card rounded-xl p-4" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', lineHeight: 1, color: s.color, letterSpacing: '0.04em' }}>{s.value}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
            <input className="input-dark rounded-lg" style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, fontSize: '0.84rem' }}
              placeholder="Search by name, email, session…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          <select className="input-dark rounded-lg" style={{ padding: '9px 12px', fontSize: '0.82rem', cursor: 'pointer', minWidth: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => <option key={val} value={val}>{cfg.label}</option>)}
          </select>

          <select className="input-dark rounded-lg" style={{ padding: '9px 12px', fontSize: '0.82rem', cursor: 'pointer', minWidth: 180 }} value={sessionFilter} onChange={e => setSessionFilter(e.target.value)}>
            {sessionTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Session Types' : t}</option>)}
          </select>

          <button onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 8, background: 'var(--surface2)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
            <ChevronDown size={14} style={{ transform: sortDir === 'asc' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
            {sortDir === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Results count */}
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {bookings.length} bookings
        </p>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <Calendar size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }}/>
            <p>No bookings match your filters.</p>
          </div>
        ) : (
          <div className="card rounded-2xl overflow-hidden">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                    {['Booking ID', 'Client', 'Session Type', 'Date & Time', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setSelected(b)}
                    >
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontFamily: 'DM Mono', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.05em' }}>{b.id.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>
                            {b.clientName[0]}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{b.clientName}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.clientEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <p style={{ fontSize: '0.83rem', fontWeight: 600 }}>{b.sessionType}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <Clock size={11} style={{ color: 'var(--text-muted)' }}/>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{b.duration}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <p style={{ fontSize: '0.83rem', fontWeight: 600 }}>{b.date}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{b.time}</p>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: 'var(--gold)', letterSpacing: '0.04em' }}>${b.price}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <StatusBadge status={b.status}/>
                      </td>
                      <td style={{ padding: '1rem' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setSelected(b)}
                            style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--gold)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                            <Eye size={12}/> View
                          </button>
                          {b.status === 'pending' && (
                            <button onClick={() => updateBookingStatus(b.id, 'confirmed')}
                              style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                              Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <DetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(id, status) => { updateBookingStatus(id, status); setSelected(null); }}
        />
      )}
    </div>
  );
}
