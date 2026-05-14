import { useState } from 'react';
import { Trash2, ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const total = cart.reduce((sum, b) => sum + b.price, 0).toFixed(2);

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); clearCart(); showToast('Order complete! Check your email.'); }, 1800);
  };

  if (done) return (
    <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <CheckCircle size={56} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>ORDER COMPLETE!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your beats have been sent to your email. Go make a hit!</p>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ShoppingCart size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>YOUR CART IS EMPTY</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse the beat store and add some heat.</p>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', maxWidth: 900, margin: '0 auto', padding: '6rem 1.5rem 3rem' }}>
      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', letterSpacing: '0.1em', marginBottom: '2rem' }}>
        YOUR <span className="gold-text">CART</span>
        <span style={{ fontFamily: 'Syne', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '1rem' }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }} className="cart-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map(beat => (
            <div key={beat.id} className="card rounded-xl p-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, background: `linear-gradient(135deg, hsl(${beat.id * 47}, 40%, 15%), hsl(${beat.id * 47 + 60}, 30%, 10%))`, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>{beat.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{beat.producer} · {beat.genre}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <span className="tag">{beat.bpm} BPM</span>
                  <span className="tag">{beat.key}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ color: 'var(--gold)', fontFamily: 'Bebas Neue', fontSize: '1.3rem', letterSpacing: '0.05em' }}>${beat.price}</p>
                <button onClick={() => removeFromCart(beat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginTop: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ alignSelf: 'start' }}>
          <div className="card rounded-2xl p-6">
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '1.25rem' }}>ORDER SUMMARY</h3>
            {cart.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{b.title}</span>
                <span>${b.price}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', color: 'var(--gold)', letterSpacing: '0.05em' }}>${total}</span>
            </div>
            <button onClick={handleCheckout} disabled={loading} className="btn-gold w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2">
              {loading ? 'Processing…' : <><CreditCard size={15} /> Checkout</>}
            </button>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 640px) { .cart-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
