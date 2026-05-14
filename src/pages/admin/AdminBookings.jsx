import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const STATUS = {
  pending:                { color: '#eab308', bg: 'rgba(234,179,8,0.1)',    label: 'Pending',               icon: <Clock size={12} /> },
  awaiting_confirmation:  { color: '#4A8FE8', bg: 'rgba(74,143,232,0.1)',  label: 'Awaiting Confirmation', icon: <Clock size={12} /> },
  confirmed:              { color: '#34C77B', bg: 'rgba(52,199,123,0.1)',   label: 'Confirmed',             icon: <CheckCircle size={12} /> },
  declined:               { color: '#F04040', bg: 'rgba(240,64,64,0.1)',    label: 'Declined',              icon: <XCircle size={12} /> },
  completed:              { color: '#D4A843', bg: 'rgba(212,168,67,0.1)',   label: 'Completed',             icon: <CheckCircle size={12} /> },
  cancelled:              { color: '#6E6A60', bg: 'rgba(110,106,96,0.1)',   label: 'Cancelled',             icon: <XCircle size={12} /> },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: '0.65rem', padding: '4px 9px', borderRadius: 4,
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}35`,
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    }}>
      {s.icon} {s.label}
    </span>
  );
}

function AssignModal({ booking, onClose }) {
  const { PRODUCERS, assignProducer } = useApp();
  const [selected, setSelected] = useState('');
  const isReassign = !!booking.assignedProducer;

  const handleAssign = () => {
    if (!selected) return;
    assignProducer(booking.id, selected);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card animate-scaleIn" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: 460 }} onClick={e => e.stopPropagation()}>

        <h2 className="font-display" style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
          {isReassign ? 'REASSIGN PRODUCER' : 'ASSIGN PRODUCER'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Booking <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono' }}>{booking.id.toUpperCase()}</span> · {booking.clientName}
          {isReassign && booking.status === 'declined' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: '0.5rem', color: '#F04040', fontSize: '0.78rem' }}>
              <AlertTriangle size={13} /> {booking.assignedProducer} declined — please reassign.
            </span>
          )}
        </p>

        {/* Booking summary */}
        <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            ['Session',  booking.sessionType],
            ['Date',     booking.date],
            ['Time',     booking.time],
            ['Duration', booking.duration],
            ['Notes',    booking.notes || 'None'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontWeight: 600, maxWidth: 220, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Producer list */}
        <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Select a Producer
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.75rem' }}>
          {PRODUCERS.map(prod => (
            <button key={prod} onClick={() => setSelected(prod)}
              style={{
                padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.875rem', transition: 'all 0.18s',
                background: selected === prod ? 'rgba(212,168,67,0.1)' : 'var(--surface2)',
                border: selected === prod ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.06)',
                opacity: prod === booking.assignedProducer && booking.status === 'declined' ? 0.45 : 1,
              }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: selected === prod ? 'var(--gold)' : 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: selected === prod ? '#000' : 'var(--text-muted)', flexShrink: 0 }}>
                {prod[0]}
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: selected === prod ? 'var(--gold)' : 'var(--text)', marginBottom: '0.1rem' }}>{prod}</p>
                <p style={{ fontSize: '0.7rem', color: prod === booking.assignedProducer && booking.status === 'declined' ? '#F04040' : 'var(--text-muted)' }}>
                  {prod === booking.assignedProducer && booking.status === 'declined' ? 'Previously declined' : 'Available'}
                </p>
              </div>
              {selected === prod && <CheckCircle size={16} style={{ color: 'var(--gold)' }} />}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn-outline" style={{ flex: 1, padding: '11px', borderRadius: 'var(--radius-md)' }}>Cancel</button>
          <button onClick={handleAssign} disabled={!selected} className="btn-gold" style={{ flex: 1, padding: '11px', borderRadius: 'var(--radius-md)' }}>
            Assign & Notify Producer
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.875rem', lineHeight: 1.6 }}>
          The producer will receive a notification and must confirm availability on their portal.
        </p>
      </div>
    </div>
  );
}

export default function AdminBookings() {
  const { bookings, updateBookingStatus } = useApp();
  const [filter,    setFilter]    = useState('all');
  const [search,    setSearch]    = useState('');
  const [assigning, setAssigning] = useState(null);

  const filters = ['all', 'pending', 'awaiting_confirmation', 'confirmed', 'declined', 'completed', 'cancelled'];
  const filterLabels = {
    all: 'All', pending: 'Pending', awaiting_confirmation: 'Awaiting',
    confirmed: 'Confirmed', declined: 'Declined', completed: 'Completed', cancelled: 'Cancelled',
  };

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b =>
      b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.sessionType.toLowerCase().includes(search.toLowerCase()) ||
      (b.assignedProducer || '').toLowerCase().includes(search.toLowerCase())
    );

  const needsAction = bookings.filter(b => b.status === 'pending' || b.status === 'declined').length;

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-raised)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '3rem 1.5rem 2.25rem' }}>
        <div className="container">
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex', color: '#F04040' }}>Admin · Bookings</span>
          <h1 className="font-display" style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em', lineHeight: 0.92, marginBottom: '0.5rem' }}>
            BOOKING <span className="gold-text">MANAGEMENT</span>
          </h1>
          {needsAction > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: '0.75rem', padding: '6px 14px', borderRadius: 20, background: 'rgba(240,64,64,0.1)', border: '1px solid rgba(240,64,64,0.25)', color: '#F04040', fontSize: '0.8rem', fontWeight: 600 }}>
              <AlertTriangle size={14} /> {needsAction} booking{needsAction !== 1 ? 's' : ''} need your attention
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          <input className="input-dark" style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
            placeholder="Search client, session, producer…" value={search} onChange={e => setSearch(e.target.value)} />
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '6px 13px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  background: filter === f ? 'var(--gold)' : 'var(--surface2)',
                  color: filter === f ? '#000' : 'var(--text-muted)',
                  border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.07)',
                }}>
                {filterLabels[f]}
                {f !== 'all' && (
                  <span style={{ marginLeft: 5, opacity: 0.75 }}>
                    ({bookings.filter(b => b.status === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Client', 'Session', 'Date & Time', 'Price', 'Assigned Producer', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1rem 1.1rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings match your filter</td></tr>
                ) : filtered.map((b, i) => (
                  <tr key={b.id} className="table-row-hover"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>

                    {/* Client */}
                    <td style={{ padding: '1rem 1.1rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{b.clientName}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{b.clientEmail}</p>
                    </td>

                    {/* Session */}
                    <td style={{ padding: '1rem 1.1rem' }}>
                      <p style={{ fontSize: '0.85rem', marginBottom: '0.15rem' }}>{b.sessionType}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.duration}</p>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '1rem 1.1rem', fontFamily: 'DM Mono', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {b.date}<br />{b.time}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '1rem 1.1rem', color: 'var(--gold)', fontFamily: 'DM Mono', fontSize: '0.875rem', fontWeight: 600 }}>
                      ${b.price}
                    </td>

                    {/* Assigned Producer */}
                    <td style={{ padding: '1rem 1.1rem' }}>
                      {b.assignedProducer ? (
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.85rem', color: b.status === 'declined' ? '#F04040' : '#34C77B' }}>
                            {b.assignedProducer}
                          </p>
                          {b.status === 'awaiting_confirmation' && (
                            <p style={{ fontSize: '0.68rem', color: '#4A8FE8', marginTop: '0.15rem' }}>Waiting for response…</p>
                          )}
                          {b.status === 'declined' && (
                            <p style={{ fontSize: '0.68rem', color: '#F04040', marginTop: '0.15rem' }}>Declined — reassign needed</p>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem 1.1rem' }}>
                      <StatusBadge status={b.status} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* Assign: pending or declined */}
                        {(b.status === 'pending' || b.status === 'declined') && (
                          <button onClick={() => setAssigning(b)} className="btn-gold"
                            style={{ padding: '6px 14px', borderRadius: 8, fontSize: '0.75rem' }}>
                            {b.status === 'declined' ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                        {/* Reassign: awaiting confirmation */}
                        {b.status === 'awaiting_confirmation' && (
                          <button onClick={() => setAssigning(b)} className="btn-outline"
                            style={{ padding: '6px 12px', borderRadius: 8, fontSize: '0.72rem' }}>
                            Reassign
                          </button>
                        )}
                        {/* Mark complete: confirmed */}
                        {b.status === 'confirmed' && (
                          <button onClick={() => updateBookingStatus(b.id, 'completed')}
                            style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(52,199,123,0.1)', border: '1px solid rgba(52,199,123,0.25)', color: '#34C77B', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.18s' }}>
                            Mark Complete
                          </button>
                        )}
                        {/* Cancel: non-terminal */}
                        {!['cancelled', 'completed'].includes(b.status) && (
                          <button onClick={() => updateBookingStatus(b.id, 'cancelled')}
                            style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(240,64,64,0.08)', border: '1px solid rgba(240,64,64,0.2)', color: 'var(--red)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.18s' }}>
                            Cancel
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

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''} shown
        </p>
      </div>

      {assigning && <AssignModal booking={assigning} onClose={() => setAssigning(null)} />}
    </div>
  );
}
