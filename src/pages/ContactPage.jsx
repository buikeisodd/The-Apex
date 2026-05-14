import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const enquiryTypes = ['General Enquiry', 'Beat Licensing', 'Studio Booking', 'Artist Signing', 'Partnership', 'Press / Media'];

export default function ContactPage() {
  const { user, showToast } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    type: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      showToast('Message sent! We\'ll be in touch within 24hrs.');
    }, 1400);
  };

  if (sent) {
    return (
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={36} style={{ color: 'var(--gold)' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>MESSAGE SENT!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Thanks for reaching out. Our team will respond within 24 business hours.
          </p>
          <button onClick={() => { setSent(false); setForm({ name: '', email: '', type: '', message: '' }); }} className="btn-outline px-6 py-3 rounded-xl text-sm">
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>Get In Touch</span>
          <h1 className="font-display" style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '0.05em' }}>
            LET'S <span className="gold-text">CONNECT</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>We respond to all enquiries within 24 hours.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }} className="contact-grid">
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Full Name</label>
                <input
                  className="input-dark rounded-xl px-4 py-3 text-sm"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Email</label>
                <input
                  className="input-dark rounded-xl px-4 py-3 text-sm"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Enquiry Type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {enquiryTypes.map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      background: form.type === t ? 'var(--gold)' : 'var(--surface2)',
                      color: form.type === t ? 'var(--black)' : 'var(--text-muted)',
                      border: form.type === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Message</label>
              <textarea
                className="input-dark rounded-xl"
                style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', resize: 'vertical', minHeight: 180, lineHeight: 1.7 }}
                placeholder="Tell us about your project, needs, or question…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold py-4 rounded-xl text-sm flex items-center justify-center gap-2" style={{ maxWidth: 280 }}>
              {loading ? 'Sending…' : <><Send size={15} /> Send Message</>}
            </button>
          </form>
        </div>

        {/* Sidebar info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card rounded-2xl p-6">
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '1.25rem' }}>CONTACT INFO</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <Mail size={16} />, label: 'Email', val: 'hello@apexlabel.ng' },
                { icon: <Phone size={16} />, label: 'Phone', val: '+234 801 234 5678' },
                { icon: <MapPin size={16} />, label: 'Studio', val: '14 Adetokunbo Ademola St, Victoria Island, Lagos' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--gold)', marginTop: 2 }}>{c.icon}</div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>{c.label}</p>
                    <p style={{ fontSize: '0.85rem' }}>{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card rounded-2xl p-6">
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '1.25rem' }}>STUDIO HOURS</h3>
            {[
              { d: 'Monday – Friday', h: '10:00 AM – 10:00 PM' },
              { d: 'Saturday', h: '11:00 AM – 11:00 PM' },
              { d: 'Sunday', h: '2:00 PM – 9:00 PM' },
            ].map(r => (
              <div key={r.d} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.d}</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono', fontSize: '0.75rem' }}>{r.h}</span>
              </div>
            ))}
          </div>

          <div className="card rounded-2xl p-6">
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '1rem' }}>FOLLOW US</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <Share2 size={18} />, label: "@apexlabel" },
                { icon: <Mail size={18} />, label: "@apexlabel" },
                { icon: <Phone size={18} />, label: "YouTube" },
              ].map(s => (
                <button key={s.label} className="btn-outline px-3 py-2 rounded-lg flex items-center gap-2" style={{ fontSize: '0.75rem' }}>
                  {s.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
