import { useState } from 'react';
import { Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { sessions, timeSlots } from '../data';
import { useApp } from '../context/AppContext';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const PAYMENT_METHODS = [
  { id:'card',        label:'Debit / Credit Card', icon:'💳', desc:'Visa, Mastercard, Verve' },
  { id:'paystack',    label:'Paystack',             icon:'🏦', desc:'Pay via Paystack gateway' },
  { id:'flutterwave', label:'Flutterwave',          icon:'🦋', desc:'Pay via Flutterwave' },
  { id:'bank',        label:'Bank Transfer',        icon:'🏛️', desc:'Direct bank transfer' },
  { id:'crypto',      label:'Crypto',               icon:'₿',  desc:'USDT, BTC, ETH accepted' },
];

function MiniCalendar({ selected, onSelect }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);
  const isToday = d => d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
  const isSel   = d => selected===`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const isPast  = d => new Date(year,month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const sel     = d => { if(!d||isPast(d)) return; onSelect(`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`); };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
        <button onClick={()=>setViewDate(new Date(year,month-1,1))} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><ChevronLeft size={16}/></button>
        <span style={{ fontWeight:700, fontSize:'0.9rem' }}>{MONTHS[month]} {year}</span>
        <button onClick={()=>setViewDate(new Date(year,month+1,1))} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><ChevronRight size={16}/></button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:2, textAlign:'center' }}>
        {DAYS.map(d=><div key={d} style={{ fontSize:'0.65rem', color:'var(--text-muted)', padding:'4px 0', fontWeight:600 }}>{d}</div>)}
        {cells.map((d,i)=>(
          <button key={i} onClick={()=>sel(d)} disabled={!d||isPast(d)}
            style={{ aspectRatio:'1', borderRadius:6, fontSize:'0.8rem', fontWeight:isSel(d)?700:400, background:isSel(d)?'var(--gold)':isToday(d)?'rgba(212,168,67,0.15)':'none', color:isSel(d)?'#000':isPast(d)||!d?'rgba(255,255,255,0.15)':'var(--text)', border:isSel(d)?'none':isToday(d)?'1px solid rgba(212,168,67,0.4)':'1px solid transparent', cursor:!d||isPast(d)?'default':'pointer', transition:'all 0.1s' }}>
            {d||''}
          </button>
        ))}
      </div>
    </div>
  );
}

function PaymentStep({ session, method, setMethod, onPay, loading }) {
  const half = (session.price / 2).toFixed(2);
  const [cardNum, setCardNum] = useState('');
  const [expiry,  setExpiry]  = useState('');
  const [cvv,     setCvv]     = useState('');
  const [name,    setName]    = useState('');

  const fmtCard   = v => v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
  const fmtExpiry = v => v.replace(/\D/g,'').replace(/(.{2})/,'$1/').slice(0,5);

  const handlePay = (e) => {
    e.preventDefault();
    onPay(method);
  };

  return (
    <div>
      <div style={{ background:'rgba(212,168,67,0.06)', border:'1px solid rgba(212,168,67,0.2)', borderRadius:'var(--radius-md)', padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'flex-start', gap:'0.75rem' }}>
        <AlertCircle size={16} style={{ color:'var(--gold)', flexShrink:0, marginTop:2 }}/>
        <div>
          <p style={{ fontWeight:700, fontSize:'0.85rem', color:'var(--gold)', marginBottom:'0.2rem' }}>50% Deposit Required</p>
          <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', lineHeight:1.6 }}>A deposit of <strong style={{ color:'var(--gold)' }}>${half}</strong> is required to confirm your session. The remaining <strong style={{ color:'var(--text)' }}>${half}</strong> is due on the day.</p>
        </div>
      </div>

      {/* Method selection */}
      <p style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.75rem' }}>Payment Method</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
        {PAYMENT_METHODS.map(m=>(
          <button key={m.id} onClick={()=>setMethod(m.id)}
            style={{ padding:'0.875rem 1rem', borderRadius:'var(--radius-md)', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.875rem', transition:'all 0.18s', background: method===m.id ? 'rgba(212,168,67,0.08)':'var(--surface2)', border: method===m.id ? '1px solid var(--gold)':'1px solid rgba(255,255,255,0.06)', textAlign:'left' }}>
            <span style={{ fontSize:'1.3rem' }}>{m.icon}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:'0.85rem', color: method===m.id ? 'var(--gold)':'var(--text)', marginBottom:'0.1rem' }}>{m.label}</p>
              <p style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{m.desc}</p>
            </div>
            {method===m.id && <div style={{ width:16, height:16, borderRadius:'50%', background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><div style={{ width:6, height:6, borderRadius:'50%', background:'#000' }}/></div>}
          </button>
        ))}
      </div>

      {/* Card form (only for card method) */}
      {method === 'card' && (
        <form onSubmit={handlePay} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
          <input className="input-dark" style={{ padding:'10px 14px', borderRadius:'var(--radius-md)', fontSize:'0.875rem' }} placeholder="Cardholder Name" value={name} onChange={e=>setName(e.target.value)} required/>
          <input className="input-dark" style={{ padding:'10px 14px', borderRadius:'var(--radius-md)', fontSize:'0.875rem', fontFamily:'DM Mono' }} placeholder="Card Number" value={cardNum} onChange={e=>setCardNum(fmtCard(e.target.value))} maxLength={19} required/>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <input className="input-dark" style={{ flex:1, padding:'10px 14px', borderRadius:'var(--radius-md)', fontSize:'0.875rem', fontFamily:'DM Mono' }} placeholder="MM/YY" value={expiry} onChange={e=>setExpiry(fmtExpiry(e.target.value))} maxLength={5} required/>
            <input className="input-dark" style={{ width:90, padding:'10px 14px', borderRadius:'var(--radius-md)', fontSize:'0.875rem', fontFamily:'DM Mono' }} placeholder="CVV" value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,'').slice(0,4))} required/>
          </div>
          <button type="submit" disabled={loading} className="btn-gold" style={{ padding:'12px', borderRadius:'var(--radius-md)', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Lock size={15}/> {loading ? 'Processing…' : `Pay $${half} Deposit`}
          </button>
          <p style={{ textAlign:'center', fontSize:'0.7rem', color:'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
            <Lock size={10}/> Secured with 256-bit SSL encryption
          </p>
        </form>
      )}

      {/* Non-card methods */}
      {method && method !== 'card' && (
        <div>
          {method === 'bank' && (
            <div style={{ background:'var(--surface2)', borderRadius:'var(--radius-md)', padding:'1rem', marginBottom:'1rem', border:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.75rem' }}>Bank Details</p>
              {[['Bank','Zenith Bank Nigeria'],['Account Name','Apex Label Ltd'],['Account No.','1234567890'],['Amount',`$${half} (₦${(half*1600).toLocaleString()})`]].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.4rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'0.82rem' }}>
                  <span style={{ color:'var(--text-muted)' }}>{k}</span><span style={{ fontWeight:600, fontFamily: k==='Account No.'?'DM Mono':'Syne' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {method === 'crypto' && (
            <div style={{ background:'var(--surface2)', borderRadius:'var(--radius-md)', padding:'1rem', marginBottom:'1rem', border:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.75rem' }}>Crypto Payment</p>
              {[['USDT (TRC20)','TXyz...abc123def456'],['Amount',`$${half} USDT`]].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.4rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'0.82rem' }}>
                  <span style={{ color:'var(--text-muted)' }}>{k}</span><span style={{ fontWeight:600, fontFamily:'DM Mono', fontSize:'0.75rem', wordBreak:'break-all', maxWidth:200, textAlign:'right' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={()=>onPay(method)} disabled={loading} className="btn-gold" style={{ width:'100%', padding:'12px', borderRadius:'var(--radius-md)', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Lock size={15}/> {loading ? 'Processing…' : `Confirm $${half} Deposit`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SessionsPage() {
  const { user, showToast, addBooking } = useApp();
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate,    setSelectedDate]    = useState('');
  const [selectedTime,    setSelectedTime]    = useState('');
  const [notes,           setNotes]           = useState('');
  const [step,            setStep]            = useState('details'); // details | payment | success
  const [payMethod,       setPayMethod]       = useState('card');
  const [loading,         setLoading]         = useState(false);
  const [bookingRef,      setBookingRef]      = useState(null);

  const handleProceedToPayment = () => {
    if (!user)             { showToast('Please sign in to book a session','error'); return; }
    if (!selectedSession)  { showToast('Please choose a session type','error');    return; }
    if (!selectedDate)     { showToast('Please pick a date','error');               return; }
    if (!selectedTime)     { showToast('Please choose a time slot','error');        return; }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePay = (method) => {
    setLoading(true);
    setTimeout(() => {
      const half = parseFloat((selectedSession.price / 2).toFixed(2));
      const booking = addBooking({
        clientName: user.name, clientEmail: user.email,
        sessionType: selectedSession.type, duration: selectedSession.duration,
        date: selectedDate, time: selectedTime, price: selectedSession.price,
        halfPaid: half, paymentStatus: 'half_paid', paymentMethod: method, notes,
      });
      setBookingRef(booking);
      setLoading(false);
      setStep('success');
      showToast('Deposit paid! Session booked 🎵');
    }, 1800);
  };

  const reset = () => { setStep('details'); setSelectedSession(null); setSelectedDate(''); setSelectedTime(''); setNotes(''); setPayMethod('card'); setBookingRef(null); };

  if (step === 'success' && bookingRef) return (
    <div style={{ paddingTop:68, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'5rem 1.5rem' }}>
      <div style={{ textAlign:'center', maxWidth:500, width:'100%' }}>
        <div className="animate-popIn" style={{ width:80, height:80, borderRadius:'50%', background:'rgba(52,199,123,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
          <CheckCircle size={40} style={{ color:'#34C77B' }}/>
        </div>
        <h2 className="font-display" style={{ fontFamily:'Bebas Neue', fontSize:'2.5rem', letterSpacing:'0.1em', marginBottom:'1rem' }}>SESSION BOOKED!</h2>
        <div className="card" style={{ borderRadius:'var(--radius-xl)', padding:'1.5rem', textAlign:'left', marginBottom:'1.5rem' }}>
          <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.75rem' }}>Booking Reference</p>
          <p style={{ fontFamily:'DM Mono', fontSize:'0.82rem', color:'var(--gold)', marginBottom:'1.25rem', letterSpacing:'0.05em' }}>{bookingRef.id.toUpperCase()}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {[['Session',bookingRef.sessionType],['Date',bookingRef.date],['Time',bookingRef.time],['Duration',bookingRef.duration],['Deposit Paid',`$${bookingRef.halfPaid}`],['Remaining',`$${bookingRef.halfPaid} (due on day)`],['Method',bookingRef.paymentMethod],['Status','Pending Admin Confirmation']].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem' }}>
                <span style={{ color:'var(--text-muted)' }}>{k}</span>
                <span style={{ fontWeight:600, color: k==='Deposit Paid'?'#34C77B': k==='Status'?'#eab308':'var(--text)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', marginBottom:'2rem', lineHeight:1.7 }}>Admin will assign a producer and confirm your session within 24 hours.</p>
        <button onClick={reset} className="btn-gold" style={{ padding:'12px 32px', borderRadius:'var(--radius-md)' }}>Book Another Session</button>
      </div>
    </div>
  );

  if (step === 'payment') return (
    <div style={{ paddingTop:68, minHeight:'100vh' }}>
      <div style={{ background:'var(--bg-raised)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'2.5rem 1.5rem 2rem' }}>
        <div className="container-sm">
          <button onClick={() => setStep('details')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:6, fontSize:'0.82rem', marginBottom:'1.25rem' }}>
            <ChevronLeft size={16}/> Back to booking details
          </button>
          <span className="section-label" style={{ marginBottom:'0.75rem', display:'inline-flex' }}>Payment</span>
          <h1 className="font-display" style={{ fontFamily:'Bebas Neue', fontSize:'clamp(2rem, 5vw, 3rem)', letterSpacing:'0.05em', lineHeight:0.92 }}>
            SECURE <span className="gold-text">PAYMENT</span>
          </h1>
        </div>
      </div>
      <div className="container-sm" style={{ padding:'2rem 1.5rem 4rem', display:'grid', gridTemplateColumns:'1fr 300px', gap:'2rem' }} className="payment-grid">
        <div>
          <PaymentStep session={selectedSession} method={payMethod} setMethod={setPayMethod} onPay={handlePay} loading={loading}/>
        </div>
        <div style={{ alignSelf:'start', position:'sticky', top:100 }}>
          <div className="card" style={{ borderRadius:'var(--radius-xl)', padding:'1.5rem' }}>
            <h3 className="font-display" style={{ fontFamily:'Bebas Neue', fontSize:'1.2rem', letterSpacing:'0.1em', marginBottom:'1.25rem', color:'var(--gold)' }}>ORDER SUMMARY</h3>
            {[['Session',selectedSession?.type],['Duration',selectedSession?.duration],['Date',selectedDate],['Time',selectedTime]].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem', fontSize:'0.82rem' }}>
                <span style={{ color:'var(--text-muted)' }}>{k}</span><span style={{ fontWeight:600 }}>{v||'—'}</span>
              </div>
            ))}
            <div className="divider" style={{ margin:'1rem 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem', fontSize:'0.82rem' }}>
              <span style={{ color:'var(--text-muted)' }}>Total</span><span style={{ fontWeight:700 }}>${selectedSession?.price}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.9rem' }}>
              <span style={{ color:'#34C77B', fontWeight:700 }}>Deposit (50%)</span>
              <span style={{ color:'#34C77B', fontFamily:'Bebas Neue', fontSize:'1.3rem', letterSpacing:'0.05em' }}>${(selectedSession?.price/2).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.payment-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );

  return (
    <div style={{ paddingTop:68, minHeight:'100vh' }}>
      <div style={{ background:'var(--bg-raised)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'3rem 1.5rem 2.25rem' }}>
        <div className="container">
          <span className="section-label" style={{ marginBottom:'1rem', display:'inline-flex' }}>Studio Sessions</span>
          <h1 className="font-display" style={{ fontFamily:'Bebas Neue', fontSize:'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing:'0.05em', lineHeight:0.92 }}>
            BOOK A <span className="gold-text">SESSION</span>
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', marginTop:'0.5rem' }}>Lagos Island · Open daily 10AM–10PM · 50% deposit required</p>
        </div>
      </div>

      <div className="container" style={{ padding:'3rem 1.5rem', display:'grid', gridTemplateColumns:'1fr 360px', gap:'2rem' }} className="sessions-grid">
        <div>
          {/* Step 1 */}
          <div style={{ marginBottom:'2.5rem' }}>
            <h2 style={{ fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:24, height:24, borderRadius:'50%', background:'var(--gold)', color:'#000', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700 }}>1</span>
              Choose Session Type
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1rem' }}>
              {sessions.map(s=>(
                <div key={s.id} onClick={()=>setSelectedSession(s)} className="card" style={{ borderRadius:'var(--radius-lg)', padding:'1.25rem', cursor:'pointer', borderColor: selectedSession?.id===s.id ? 'var(--gold)':undefined, background: selectedSession?.id===s.id ? 'rgba(212,168,67,0.05)':'var(--surface)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                    <h3 style={{ fontWeight:700, fontSize:'0.9rem' }}>{s.type}</h3>
                    <span style={{ color:'var(--gold)', fontFamily:'Bebas Neue', fontSize:'1.1rem', letterSpacing:'0.04em' }}>${s.price}</span>
                  </div>
                  <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', lineHeight:1.65, marginBottom:'0.5rem' }}>{s.desc}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={12} style={{ color:'var(--gold)' }}/><span style={{ fontSize:'0.7rem', color:'var(--gold)', fontFamily:'DM Mono' }}>{s.duration}</span></div>
                  {selectedSession?.id===s.id && <p style={{ fontSize:'0.65rem', color:'#34C77B', marginTop:'0.5rem', fontWeight:600 }}>✓ Deposit: ${(s.price/2).toFixed(2)}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ marginBottom:'2.5rem' }}>
            <h2 style={{ fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:24, height:24, borderRadius:'50%', background: selectedSession?'var(--gold)':'var(--surface3)', color: selectedSession?'#000':'var(--text-muted)', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700 }}>2</span>
              Pick a Date
            </h2>
            <div className="card" style={{ borderRadius:'var(--radius-lg)', padding:'1.25rem', maxWidth:280 }}>
              <MiniCalendar selected={selectedDate} onSelect={setSelectedDate}/>
            </div>
          </div>

          {selectedDate && (
            <div style={{ marginBottom:'2.5rem' }}>
              <h2 style={{ fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:24, height:24, borderRadius:'50%', background:'var(--gold)', color:'#000', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700 }}>3</span>
                Choose Time
              </h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                {timeSlots.map(t=>(
                  <button key={t} onClick={()=>setSelectedTime(t)}
                    style={{ padding:'8px 16px', borderRadius:8, fontSize:'0.8rem', fontWeight:600, cursor:'pointer', transition:'all 0.15s', background: selectedTime===t?'var(--gold)':'var(--surface2)', color: selectedTime===t?'#000':'var(--text-muted)', border: selectedTime===t?'none':'1px solid rgba(255,255,255,0.07)' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTime && (
            <div style={{ marginBottom:'2rem' }}>
              <h2 style={{ fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:24, height:24, borderRadius:'50%', background:'var(--gold)', color:'#000', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700 }}>4</span>
                Notes <span style={{ color:'var(--text-muted)', fontWeight:400, fontSize:'0.7rem' }}>(optional)</span>
              </h2>
              <textarea className="input-dark" style={{ padding:'0.875rem 1rem', borderRadius:'var(--radius-md)', fontSize:'0.875rem', resize:'vertical', minHeight:90, lineHeight:1.65 }}
                placeholder="Tell us about your project, references, goals…" value={notes} onChange={e=>setNotes(e.target.value)}/>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position:'sticky', top:100, alignSelf:'start' }}>
          <div className="card" style={{ borderRadius:'var(--radius-xl)', padding:'1.5rem' }}>
            <h3 className="font-display" style={{ fontFamily:'Bebas Neue', fontSize:'1.2rem', letterSpacing:'0.1em', marginBottom:'1.5rem', color:'var(--gold)' }}>BOOKING SUMMARY</h3>
            {[['Session',selectedSession?.type],['Duration',selectedSession?.duration],['Date',selectedDate],['Time',selectedTime]].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.625rem', fontSize:'0.85rem' }}>
                <span style={{ color:'var(--text-muted)' }}>{k}</span><span style={{ fontWeight:600 }}>{v||'—'}</span>
              </div>
            ))}
            <div className="divider" style={{ margin:'1rem 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem', fontSize:'0.85rem' }}>
              <span style={{ color:'var(--text-muted)' }}>Session Total</span>
              <span style={{ fontWeight:700 }}>{selectedSession ? `$${selectedSession.price}`:'-'}</span>
            </div>
            {selectedSession && (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'1.25rem' }}>
                  <span style={{ color:'#34C77B', fontWeight:600 }}>Deposit Now (50%)</span>
                  <span style={{ fontFamily:'Bebas Neue', fontSize:'1.4rem', color:'#34C77B', letterSpacing:'0.04em' }}>${(selectedSession.price/2).toFixed(2)}</span>
                </div>
                <div style={{ background:'rgba(52,199,123,0.08)', border:'1px solid rgba(52,199,123,0.2)', borderRadius:'var(--radius-md)', padding:'0.75rem', marginBottom:'1.25rem' }}>
                  <p style={{ fontSize:'0.72rem', color:'#34C77B', lineHeight:1.6 }}>💡 Pay 50% now to reserve your slot. The remaining ${(selectedSession.price/2).toFixed(2)} is collected on session day.</p>
                </div>
              </>
            )}
            <button onClick={handleProceedToPayment} disabled={!selectedSession||!selectedDate||!selectedTime} className="btn-gold" style={{ width:'100%', padding:'12px', borderRadius:'var(--radius-md)', fontSize:'0.875rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <CreditCard size={15}/> Proceed to Payment
            </button>
            {!user && <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', textAlign:'center', marginTop:'0.75rem' }}>Sign in to book a session</p>}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.sessions-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
