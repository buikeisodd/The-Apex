import { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CheckoutModal({ beat, onClose }) {
  const { showToast } = useApp();
  const [licenseType, setLicenseType] = useState('lease');
  const [step, setStep] = useState('details'); // details | payment | success
  const [form, setForm] = useState({ card: '', expiry: '', cvv: '', name: '' });
  const [loading, setLoading] = useState(false);

  const price = licenseType === 'exclusive' ? beat.exclusive : beat.price;

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      showToast(`"${beat.title}" purchased successfully!`);
    }, 1800);
  };

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => val.replace(/\D/g, '').replace(/(.{2})/, '$1/').slice(0, 5);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card rounded-2xl animate-fadeUp" style={{ background: 'var(--surface)', width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>

        {step === 'success' ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={36} style={{ color: 'var(--gold)' }} />
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>PURCHASE COMPLETE</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              <strong style={{ color: 'var(--text)' }}>{beat.title}</strong> – {licenseType === 'exclusive' ? 'Exclusive License' : 'Lease License'}
            </p>
            <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '2rem' }}>${price}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2rem' }}>A receipt and download link have been sent to your email.</p>
            <button className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
              <Download size={16} /> Download Beat
            </button>
            <button onClick={onClose} className="btn-outline w-full py-3 rounded-xl text-sm" style={{ marginTop: '0.75rem' }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', letterSpacing: '0.1em', marginBottom: '1.5rem', paddingRight: 32 }}>CHECKOUT</h2>

            {/* Beat summary */}
            <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>{beat.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{beat.producer} · {beat.genre}</p>
              </div>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', color: 'var(--gold)', letterSpacing: '0.05em' }}>${price}</p>
            </div>

            {/* License type */}
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>License Type</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
              {[
                { val: 'lease', label: 'Lease', price: beat.price, desc: 'Non-exclusive, up to 100K streams' },
                { val: 'exclusive', label: 'Exclusive', price: beat.exclusive, desc: 'Full ownership, unlimited use' },
              ].map(l => (
                <button key={l.val} onClick={() => setLicenseType(l.val)}
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    background: licenseType === l.val ? 'rgba(201,168,76,0.12)' : 'var(--surface2)',
                    border: licenseType === l.val ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: licenseType === l.val ? 'var(--gold)' : 'var(--text)', marginBottom: 2 }}>{l.label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>${l.price}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{l.desc}</p>
                </button>
              ))}
            </div>

            {/* Payment form */}
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={12} /> Payment Details
              </p>
              <input
                className="input-dark rounded-lg px-4 py-3 text-sm"
                placeholder="Cardholder Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                className="input-dark rounded-lg px-4 py-3 text-sm font-mono-dm"
                placeholder="Card Number"
                value={form.card}
                onChange={e => setForm(f => ({ ...f, card: formatCard(e.target.value) }))}
                maxLength={19}
                required
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  className="input-dark rounded-lg px-4 py-3 text-sm font-mono-dm flex-1"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                  maxLength={5}
                  required
                />
                <input
                  className="input-dark rounded-lg px-4 py-3 text-sm font-mono-dm"
                  placeholder="CVV"
                  value={form.cvv}
                  onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  style={{ width: 80 }}
                  required
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'Bebas Neue', fontSize: '1.3rem', letterSpacing: '0.05em' }}>${price}</span>
              </div>

              <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                {loading ? 'Processing…' : <><CreditCard size={16} /> Pay ${price}</>}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Lock size={10} /> Secured with 256-bit SSL encryption
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
