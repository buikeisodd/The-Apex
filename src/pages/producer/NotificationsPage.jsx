import { Calendar, CheckCircle, XCircle, Bell, Clock, User, Music } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const STATUS_STYLES = {
  confirmed: { bg: 'rgba(52,199,123,0.12)', color: '#34C77B', label: 'You Confirmed' },
  declined:  { bg: 'rgba(240,64,64,0.12)',  color: '#F04040', label: 'You Declined'  },
};

function NotificationCard({ notif, onConfirm, onDecline }) {
  const { bookings } = useApp();
  const booking = bookings.find(b => b.id === notif.bookingId);
  const responded = notif.producerResponse !== null;
  const style = responded ? STATUS_STYLES[notif.producerResponse] : null;

  return (
    <div
      className="card"
      style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        borderColor: !notif.read && !responded
          ? 'rgba(212,168,67,0.4)'
          : responded && notif.producerResponse === 'confirmed'
            ? 'rgba(52,199,123,0.25)'
            : responded && notif.producerResponse === 'declined'
              ? 'rgba(240,64,64,0.2)'
              : 'rgba(255,255,255,0.06)',
        animation: 'fadeUp 0.5s var(--ease-out) forwards',
      }}
    >
      {/* Top colour bar */}
      <div style={{
        height: 4,
        background: !responded
          ? 'linear-gradient(90deg, var(--gold-dim), var(--gold))'
          : notif.producerResponse === 'confirmed'
            ? 'linear-gradient(90deg, #1a9e56, #34C77B)'
            : 'linear-gradient(90deg, #b02020, #F04040)',
      }} />

      <div style={{ padding: '1.75rem' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              background: !responded ? 'rgba(212,168,67,0.12)' : `${style.bg}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Calendar size={20} style={{ color: !responded ? 'var(--gold)' : style.color }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Session Assignment</p>
                {!notif.read && !responded && (
                  <span style={{ fontSize: '0.58rem', padding: '2px 7px', borderRadius: 3, background: 'var(--gold)', color: '#000', fontWeight: 700, letterSpacing: '0.08em' }}>NEW</span>
                )}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>
                {new Date(notif.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Response badge */}
          {responded && (
            <span style={{
              fontSize: '0.68rem', padding: '4px 12px', borderRadius: 20,
              background: style.bg, color: style.color,
              border: `1px solid ${style.color}40`,
              fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {notif.producerResponse === 'confirmed'
                ? <CheckCircle size={12} />
                : <XCircle size={12} />}
              {style.label}
            </span>
          )}
        </div>

        {/* Message */}
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
          {notif.message}
        </p>

        {/* Booking detail grid */}
        {booking && (
          <div style={{
            background: 'var(--surface2)', borderRadius: 'var(--radius-md)',
            padding: '1.25rem', marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Session Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {[
                { icon: <User size={13} />,    label: 'Client',   value: booking.clientName },
                { icon: <Music size={13} />,   label: 'Session',  value: booking.sessionType },
                { icon: <Calendar size={13} />,label: 'Date',     value: booking.date },
                { icon: <Clock size={13} />,   label: 'Time',     value: booking.time },
                { icon: <Clock size={13} />,   label: 'Duration', value: booking.duration },
                { icon: null,                  label: 'Fee',      value: `$${booking.price}` },
              ].map(({ icon, label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {icon} {label}
                  </p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: label === 'Fee' ? 'var(--gold)' : 'var(--text)' }}>{value}</p>
                </div>
              ))}
            </div>
            {booking.notes && (
              <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Client Notes</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{booking.notes}"</p>
              </div>
            )}
          </div>
        )}

        {/* Action buttons — only show if not yet responded */}
        {!responded ? (
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.875rem', lineHeight: 1.6 }}>
              Please confirm whether you are available for this session. The client will be notified of your response.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={onConfirm}
                className="btn-gold"
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
              >
                <CheckCircle size={16} /> I'm Available — Confirm
              </button>
              <button
                onClick={onDecline}
                style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(240,64,64,0.1)', border: '1px solid rgba(240,64,64,0.3)',
                  color: 'var(--red)', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,64,64,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,64,64,0.1)'}
              >
                <XCircle size={16} /> Not Available — Decline
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
            background: style.bg, border: `1px solid ${style.color}30`,
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            {notif.producerResponse === 'confirmed'
              ? <CheckCircle size={18} style={{ color: '#34C77B', flexShrink: 0 }} />
              : <XCircle size={18} style={{ color: '#F04040', flexShrink: 0 }} />}
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: style.color, marginBottom: '0.1rem' }}>
                {notif.producerResponse === 'confirmed' ? 'You confirmed this session' : 'You declined this session'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {notif.producerResponse === 'confirmed'
                  ? 'The client has been notified. See you in the studio!'
                  : 'The admin has been notified and will reassign this session.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { user, notifications, markNotificationRead, confirmSession, declineSession } = useApp();
  const myNotifs = (notifications[user?.name] || [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unread = myNotifs.filter(n => !n.read).length;
  const pending = myNotifs.filter(n => n.producerResponse === null).length;

  const handleConfirm = (notif) => {
    confirmSession(user.name, notif.bookingId, notif.id);
  };

  const handleDecline = (notif) => {
    declineSession(user.name, notif.bookingId, notif.id);
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-raised)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '3rem 1.5rem 2.25rem' }}>
        <div className="container-sm">
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Producer Portal</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="font-display" style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.05em', lineHeight: 0.92 }}>
                NOTIFICATIONS
                {unread > 0 && (
                  <span style={{ fontFamily: 'Syne', fontSize: '1rem', color: 'var(--red)', fontWeight: 700, marginLeft: '0.75rem', verticalAlign: 'middle' }}>
                    {unread} unread
                  </span>
                )}
              </h1>
              {pending > 0 && (
                <p style={{ color: '#eab308', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600 }}>
                  ⚠️ {pending} session{pending !== 1 ? 's' : ''} awaiting your response
                </p>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={() => myNotifs.filter(n => !n.read).forEach(n => markNotificationRead(user.name, n.id))}
                className="btn-outline"
                style={{ padding: '9px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-sm" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        {myNotifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Bell size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h2 className="font-display" style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>ALL CAUGHT UP</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              No notifications yet. When the admin assigns you to a session, it will appear here for your confirmation.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Pending response section */}
            {myNotifs.filter(n => n.producerResponse === null).length > 0 && (
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#eab308', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
                  Awaiting Your Response
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {myNotifs.filter(n => n.producerResponse === null).map(n => (
                    <NotificationCard
                      key={n.id}
                      notif={n}
                      onConfirm={() => handleConfirm(n)}
                      onDecline={() => handleDecline(n)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past responses */}
            {myNotifs.filter(n => n.producerResponse !== null).length > 0 && (
              <div style={{ marginTop: myNotifs.filter(n => n.producerResponse === null).length > 0 ? '1.5rem' : 0 }}>
                {myNotifs.filter(n => n.producerResponse === null).length > 0 && (
                  <div className="divider-subtle" style={{ marginBottom: '1.5rem' }} />
                )}
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Past Responses
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {myNotifs.filter(n => n.producerResponse !== null).map(n => (
                    <NotificationCard
                      key={n.id}
                      notif={n}
                      onConfirm={() => {}}
                      onDecline={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
