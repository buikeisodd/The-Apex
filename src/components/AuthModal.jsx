import { useState } from 'react';
import { X, Mail, Eye, EyeOff, Loader, Check, AlertCircle, User, Phone, MapPin, Music, FileText, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.22 1.3-2.2 3.88.03 3.02 2.65 4.03 2.68 4.04l-.03.14zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function getPasswordStrength(pwd) {
  const checks = { length: pwd.length >= 8, upper: /[A-Z]/.test(pwd), lower: /[a-z]/.test(pwd), number: /[0-9]/.test(pwd), special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd), long: pwd.length >= 12 };
  const score = Object.values(checks).filter(Boolean).length;
  const level = score <= 2 ? 'weak' : score <= 4 ? 'fair' : score <= 5 ? 'good' : 'strong';
  return { score, checks, level };
}

function PasswordStrengthBar({ password }) {
  const { score, checks, level } = getPasswordStrength(password);
  const colors = { weak: '#F04040', fair: '#eab308', good: '#4A8FE8', strong: '#34C77B' };
  const color = colors[level];
  if (!password) return null;
  return (
    <div style={{ marginTop: '0.625rem' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: '0.5rem' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? color : 'var(--surface4)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.3rem' }}>
        {[{ key:'length',label:'8+ chars'},{ key:'upper',label:'Uppercase'},{ key:'lower',label:'Lowercase'},{ key:'number',label:'Number'},{ key:'special',label:'Symbol'},{ key:'long',label:'12+ chars'}].map(c => (
          <span key={c.key} style={{ fontSize:'0.58rem', padding:'2px 6px', borderRadius:10, fontFamily:'DM Mono', background: checks[c.key] ? `${color}18`:'var(--surface3)', color: checks[c.key] ? color:'var(--text-muted)', border:`1px solid ${checks[c.key]?`${color}35`:'transparent'}`, transition:'all 0.2s', display:'flex', alignItems:'center', gap:3 }}>
            {checks[c.key] && <Check size={7} />}{c.label}
          </span>
        ))}
      </div>
      <p style={{ fontSize:'0.65rem', color, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Strength: {level}</p>
    </div>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p style={{ fontSize:'0.68rem', color:'var(--red)', display:'flex', alignItems:'center', gap:4, marginTop:'0.3rem' }}><AlertCircle size={10}/>{msg}</p>;
}

function Field({ label, icon, error, required, children }) {
  return (
    <div>
      <label style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:4 }}>
        {icon}{label}{required && <span style={{ color:'var(--red)' }}>*</span>}
      </label>
      {children}
      <FieldError msg={error}/>
    </div>
  );
}

const ROLES     = [{ id:'client', label:'Client', emoji:'🎵', desc:'Buy beats & book sessions' }, { id:'producer', label:'Producer', emoji:'🎛️', desc:'Upload & sell beats' }, { id:'admin', label:'Admin', emoji:'⚙️', desc:'Label management portal' }];
const COUNTRIES = ['Nigeria','Ghana','Kenya','South Africa','Tanzania','Uganda','Cameroon','Senegal','Ivory Coast','Ethiopia','UK','USA','Canada','Other'];
const GENRES    = ['Afrobeats','Trap','Drill','R&B','Hip-Hop','Boom Bap','Dancehall','Pop','Gospel','Reggae','Other'];

export default function AuthModal({ onClose }) {
  const { login, showToast, registerUser } = useApp();
  const [mode,        setMode]        = useState('login');
  const [role,        setRole]        = useState('client');
  const [step,        setStep]        = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors,      setErrors]      = useState({});
  const [agreed,      setAgreed]      = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirmPassword:'', country:'', city:'', genre:'', bio:'', dob:'', username:'' });

  const set = (k, v) => { setForm(f => ({...f,[k]:v})); setErrors(e => ({...e,[k]:''})); };
  const iStyle = (f) => ({ padding:'10px 14px', borderRadius:'var(--radius-md)', fontSize:'0.875rem', border: errors[f] ? '1px solid var(--red)' : undefined, boxShadow: errors[f] ? '0 0 0 2px rgba(240,64,64,0.1)' : undefined });

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName = 'First name is required';
    if (!form.lastName.trim())   e.lastName  = 'Last name is required';
    if (!form.username.trim())   e.username  = 'Username is required';
    else if (form.username.length < 3) e.username = 'At least 3 characters';
    else if (/\s/.test(form.username)) e.username = 'No spaces allowed';
    if (!form.email.trim())      e.email     = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.phone.trim())      e.phone     = 'Phone number is required';
    else if (!/^\+?[\d\s\-()]{8,}$/.test(form.phone)) e.phone = 'Invalid phone number';
    if (!form.dob)               e.dob       = 'Date of birth is required';
    else { const age = new Date().getFullYear() - new Date(form.dob).getFullYear(); if (age < 16) e.dob = 'Must be at least 16 years old'; }
    if (!form.password)          e.password  = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    else if (getPasswordStrength(form.password).level === 'weak') e.password = 'Password too weak — add uppercase, numbers or symbols';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must agree to the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.country) e.country = 'Please select your country';
    if (!form.city.trim()) e.city = 'City is required';
    if (role === 'producer' && !form.genre) e.genre = 'Select your primary genre';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSocial = (provider) => {
    setLoading(true);
    setTimeout(() => {
      login({ name:`${provider} User`, email:`user@${provider.toLowerCase()}.com`, avatar:provider[0], role, provider });
      showToast(`Signed in with ${provider}!`);
      setLoading(false); onClose();
    }, 1200);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.email) er.email = 'Email is required';
    if (!form.password) er.password = 'Password is required';
    if (Object.keys(er).length) { setErrors(er); return; }
    setLoading(true);
    setTimeout(() => {
      login({ name:form.email.split('@')[0], email:form.email, avatar:form.email[0].toUpperCase(), role, provider:'Email' });
      showToast('Welcome back!'); setLoading(false); onClose();
    }, 1200);
  };

  const handleStep1Next = (e) => { e.preventDefault(); if (validateStep1()) setStep(2); };

  const handleRegisterComplete = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setTimeout(() => {
      registerUser({ firstName:form.firstName, lastName:form.lastName, email:form.email, phone:form.phone, country:form.country, city:form.city, genre:form.genre, bio:form.bio, dob:form.dob, username:form.username, role, provider:'Email' });
      login({ name:`${form.firstName} ${form.lastName}`, email:form.email, avatar:form.firstName[0].toUpperCase(), role, provider:'Email', username:form.username });
      showToast(`Welcome to Apex Label, ${form.firstName}! 🎵`);
      setLoading(false); onClose();
    }, 1400);
  };

  // ── LOGO SVG ─────────────────────────────────────────────────────────────
  const Logo = () => (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:48, height:48 }}>
      <circle cx="26" cy="26" r="25" stroke="url(#lg1)" strokeWidth="1.5" fill="url(#lg2)"/>
      <circle cx="26" cy="26" r="10" stroke="url(#lg1)" strokeWidth="1" fill="none" opacity="0.4"/>
      <circle cx="26" cy="26" r="4" fill="#D4A843"/>
      <line x1="26" y1="1"  x2="26" y2="16" stroke="url(#lg1)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="36" x2="26" y2="51" stroke="url(#lg1)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="1"  y1="26" x2="16" y2="26" stroke="url(#lg1)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="36" y1="26" x2="51" y2="26" stroke="url(#lg1)" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0C860"/><stop offset="1" stopColor="#96721E"/>
        </linearGradient>
        <radialGradient id="lg2" cx="50%" cy="30%" r="70%">
          <stop stopColor="#1A1A24"/><stop offset="1" stopColor="#0D0D10"/>
        </radialGradient>
      </defs>
    </svg>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="animate-scaleIn" style={{ background:'var(--surface)', borderRadius:'var(--radius-xl)', width:'100%', maxWidth: mode==='register' ? 500 : 440, maxHeight:'95vh', overflowY:'auto', position:'relative', border:'1px solid rgba(255,255,255,0.07)', boxShadow:'var(--shadow-lg)' }} onClick={e=>e.stopPropagation()}>
        <div style={{ height:3, background:'linear-gradient(90deg,var(--gold-dim),var(--gold),var(--gold-dim))', borderRadius:'18px 18px 0 0' }}/>
        <div style={{ padding:'1.75rem 2rem 2rem' }}>

          {/* Close */}
          <button onClick={onClose} style={{ position:'absolute', top:14, right:14, background:'var(--surface2)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-muted)' }}>
            <X size={15}/>
          </button>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.75rem' }}><Logo/></div>
            <p style={{ fontFamily:'Bebas Neue', fontSize:'1.4rem', letterSpacing:'0.2em', color:'var(--gold)', marginBottom:'0.2rem' }}>APEX LABEL</p>
            <p style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>
              {mode==='login' ? 'Welcome back — sign in to continue' : step===1 ? 'Create your account · Step 1 of 2' : 'Complete your profile · Step 2 of 2'}
            </p>
          </div>

          {/* Progress bar (register only) */}
          {mode==='register' && (
            <div style={{ display:'flex', gap:6, marginBottom:'1.5rem' }}>
              {[1,2].map(s=><div key={s} style={{ flex:1, height:3, borderRadius:2, background: s<=step ? 'var(--gold)':'var(--surface3)', transition:'background 0.3s' }}/>)}
            </div>
          )}

          {/* ── LOGIN ──────────────────────────────────────────────────────── */}
          {mode==='login' && (
            <>
              <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
                {ROLES.map(r=>(
                  <button key={r.id} onClick={()=>setRole(r.id)} style={{ flex:1, padding:'0.625rem', borderRadius:'var(--radius-md)', cursor:'pointer',
                    border: role===r.id
                      ? `1px solid ${r.id==='admin'?'#F04040':'var(--gold)'}`
                      : '1px solid rgba(255,255,255,0.07)',
                    background: role===r.id
                      ? r.id==='admin' ? 'rgba(240,64,64,0.1)' : 'rgba(212,168,67,0.1)'
                      : 'var(--surface2)',
                    transition:'all 0.2s', textAlign:'center' }}>
                    <div style={{ fontSize:'1rem', marginBottom:'0.1rem' }}>{r.emoji}</div>
                    <p style={{ fontSize:'0.72rem', fontWeight:700, color: role===r.id ? (r.id==='admin'?'#F04040':'var(--gold)') :'var(--text-muted)' }}>{r.label}</p>
                  </button>
                ))}
              </div>
              {role==='admin' && (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0.625rem 0.875rem', borderRadius:'var(--radius-md)', background:'rgba(240,64,64,0.08)', border:'1px solid rgba(240,64,64,0.2)', marginBottom:'1.25rem' }}>
                  <span style={{ fontSize:'1rem' }}>🔐</span>
                  <p style={{ fontSize:'0.72rem', color:'#F04040', lineHeight:1.5 }}>Admin access is restricted to authorised label staff only.</p>
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.25rem' }}>
                {[{label:'Continue with Google',icon:<GoogleIcon/>,p:'Google'},{label:'Continue with Apple',icon:<AppleIcon/>,p:'Apple'}].map(b=>(
                  <button key={b.p} onClick={()=>handleSocial(b.p)} disabled={loading} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:'10px', borderRadius:'var(--radius-md)', background:'var(--surface2)', border:'1px solid rgba(255,255,255,0.07)', color:'var(--text)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>
                    {b.icon}{b.label}
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
                <div className="divider" style={{ flex:1 }}/><span style={{ color:'var(--text-muted)', fontSize:'0.7rem' }}>or email</span><div className="divider" style={{ flex:1 }}/>
              </div>
              <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
                <Field label="Email" icon={<Mail size={10}/>} error={errors.email} required>
                  <input className="input-dark" style={iStyle('email')} type="email" placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)}/>
                </Field>
                <Field label="Password" icon={<Shield size={10}/>} error={errors.password} required>
                  <div style={{ position:'relative' }}>
                    <input className="input-dark" style={{...iStyle('password'),paddingRight:'2.75rem'}} type={showPass?'text':'password'} placeholder="Your password" value={form.password} onChange={e=>set('password',e.target.value)}/>
                    <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
                      {showPass?<EyeOff size={14}/>:<Eye size={14}/>}
                    </button>
                  </div>
                </Field>
                <button type="submit" disabled={loading} className="btn-gold" style={{ padding:'11px', borderRadius:'var(--radius-md)', fontSize:'0.875rem', width:'100%' }}>
                  {loading ? <><Loader size={14} className="animate-spin-icon"/>Signing in…</>:'Sign In'}
                </button>
              </form>
              <p style={{ textAlign:'center', marginTop:'1.1rem', fontSize:'0.78rem', color:'var(--text-muted)' }}>
                No account? <button onClick={()=>{setMode('register');setStep(1);setErrors({});}} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gold)', fontWeight:700 }}>Sign up free</button>
              </p>
            </>
          )}

          {/* ── REGISTER STEP 1 ────────────────────────────────────────────── */}
          {mode==='register' && step===1 && (
            <>
              <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
                {ROLES.filter(r=>r.id!=='admin').map(r=>(
                  <button key={r.id} onClick={()=>setRole(r.id)} style={{ flex:1, padding:'0.625rem 0.5rem', borderRadius:'var(--radius-md)', cursor:'pointer', border: role===r.id ?'1px solid var(--gold)':'1px solid rgba(255,255,255,0.07)', background: role===r.id ?'rgba(212,168,67,0.1)':'var(--surface2)', transition:'all 0.2s', textAlign:'center' }}>
                    <div style={{ fontSize:'1rem', marginBottom:'0.1rem' }}>{r.emoji}</div>
                    <p style={{ fontSize:'0.75rem', fontWeight:700, color: role===r.id ?'var(--gold)':'var(--text)', marginBottom:'0.1rem' }}>{r.label}</p>
                    <p style={{ fontSize:'0.6rem', color:'var(--text-muted)' }}>{r.desc}</p>
                  </button>
                ))}
              </div>
              <form onSubmit={handleStep1Next} style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.625rem' }}>
                  <Field label="First Name" icon={<User size={10}/>} error={errors.firstName} required>
                    <input className="input-dark" style={iStyle('firstName')} placeholder="John" value={form.firstName} onChange={e=>set('firstName',e.target.value)}/>
                  </Field>
                  <Field label="Last Name" icon={<User size={10}/>} error={errors.lastName} required>
                    <input className="input-dark" style={iStyle('lastName')} placeholder="Doe" value={form.lastName} onChange={e=>set('lastName',e.target.value)}/>
                  </Field>
                </div>
                <Field label="Username" icon={<span style={{fontFamily:'DM Mono',fontSize:'0.65rem'}}>@</span>} error={errors.username} required>
                  <input className="input-dark" style={iStyle('username')} placeholder="johndoe" value={form.username} onChange={e=>set('username',e.target.value.toLowerCase().replace(/\s/g,''))}/>
                </Field>
                <Field label="Email Address" icon={<Mail size={10}/>} error={errors.email} required>
                  <input className="input-dark" style={iStyle('email')} type="email" placeholder="john@email.com" value={form.email} onChange={e=>set('email',e.target.value)}/>
                </Field>
                <Field label="Phone Number" icon={<Phone size={10}/>} error={errors.phone} required>
                  <input className="input-dark" style={iStyle('phone')} type="tel" placeholder="+234 801 234 5678" value={form.phone} onChange={e=>set('phone',e.target.value)}/>
                </Field>
                <Field label="Date of Birth" icon={<User size={10}/>} error={errors.dob} required>
                  <input className="input-dark" style={iStyle('dob')} type="date" value={form.dob} onChange={e=>set('dob',e.target.value)} max={new Date().toISOString().split('T')[0]}/>
                </Field>
                <Field label="Password" icon={<Shield size={10}/>} error={errors.password} required>
                  <div style={{ position:'relative' }}>
                    <input className="input-dark" style={{...iStyle('password'),paddingRight:'2.75rem'}} type={showPass?'text':'password'} placeholder="Min. 8 chars" value={form.password} onChange={e=>set('password',e.target.value)}/>
                    <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
                      {showPass?<EyeOff size={14}/>:<Eye size={14}/>}
                    </button>
                  </div>
                  <PasswordStrengthBar password={form.password}/>
                </Field>
                <Field label="Confirm Password" icon={<Shield size={10}/>} error={errors.confirmPassword} required>
                  <div style={{ position:'relative' }}>
                    <input className="input-dark" style={{...iStyle('confirmPassword'),paddingRight:'2.75rem'}} type={showConfirm?'text':'password'} placeholder="Re-enter password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)}/>
                    <button type="button" onClick={()=>setShowConfirm(!showConfirm)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
                      {showConfirm?<EyeOff size={14}/>:<Eye size={14}/>}
                    </button>
                  </div>
                </Field>
                {/* Terms */}
                <div>
                  <label style={{ display:'flex', alignItems:'flex-start', gap:'0.625rem', cursor:'pointer' }}>
                    <div onClick={()=>setAgreed(!agreed)} style={{ width:17, height:17, borderRadius:4, border: errors.agreed ?'1px solid var(--red)':`1px solid ${agreed?'var(--gold)':'rgba(255,255,255,0.15)'}`, background: agreed?'var(--gold)':'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, transition:'all 0.18s', cursor:'pointer' }}>
                      {agreed && <Check size={10} style={{ color:'#000' }}/>}
                    </div>
                    <span style={{ fontSize:'0.72rem', color:'var(--text-secondary)', lineHeight:1.65 }}>
                      I agree to Apex Label's <span style={{ color:'var(--gold)', fontWeight:600 }}>Terms of Service</span>, <span style={{ color:'var(--gold)', fontWeight:600 }}>Privacy Policy</span> and <span style={{ color:'var(--gold)', fontWeight:600 }}>Content Guidelines</span>.
                    </span>
                  </label>
                  <FieldError msg={errors.agreed}/>
                </div>
                <button type="submit" className="btn-gold" style={{ padding:'11px', borderRadius:'var(--radius-md)', fontSize:'0.875rem', width:'100%', marginTop:'0.25rem' }}>
                  Continue → Profile Setup
                </button>
              </form>
              <p style={{ textAlign:'center', marginTop:'1rem', fontSize:'0.75rem', color:'var(--text-muted)' }}>
                Have an account? <button onClick={()=>{setMode('login');setErrors({});}} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gold)', fontWeight:700 }}>Sign In</button>
              </p>
            </>
          )}

          {/* ── REGISTER STEP 2 ────────────────────────────────────────────── */}
          {mode==='register' && step===2 && (
            <>
              <form onSubmit={handleRegisterComplete} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.625rem' }}>
                  <Field label="Country" icon={<MapPin size={10}/>} error={errors.country} required>
                    <select className="input-dark" style={{...iStyle('country'),cursor:'pointer'}} value={form.country} onChange={e=>set('country',e.target.value)}>
                      <option value="">Select…</option>
                      {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="City" icon={<MapPin size={10}/>} error={errors.city} required>
                    <input className="input-dark" style={iStyle('city')} placeholder="Lagos" value={form.city} onChange={e=>set('city',e.target.value)}/>
                  </Field>
                </div>
                {role==='producer' && (
                  <Field label="Primary Genre" icon={<Music size={10}/>} error={errors.genre} required>
                    <select className="input-dark" style={{...iStyle('genre'),cursor:'pointer'}} value={form.genre} onChange={e=>set('genre',e.target.value)}>
                      <option value="">Select genre…</option>
                      {GENRES.map(g=><option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                )}
                <Field label={`Bio ${role==='producer'?'(your sound)':'(optional)'}`} icon={<FileText size={10}/>} error={errors.bio}>
                  <textarea className="input-dark" style={{...iStyle('bio'),resize:'vertical',minHeight:80,lineHeight:1.65}} placeholder={role==='producer'?'Describe your production style…':'Tell us about yourself as an artist…'} value={form.bio} onChange={e=>set('bio',e.target.value)} maxLength={300}/>
                  <p style={{ fontSize:'0.6rem', color:'var(--text-muted)', textAlign:'right', marginTop:'0.15rem' }}>{form.bio.length}/300</p>
                </Field>
                {/* Summary */}
                <div style={{ background:'var(--surface2)', borderRadius:'var(--radius-md)', padding:'0.875rem', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.625rem' }}>Account Summary</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                    {[['Name',`${form.firstName} ${form.lastName}`],['Username',`@${form.username}`],['Email',form.email],['Role',role.charAt(0).toUpperCase()+role.slice(1)]].map(([k,v])=>(
                      <div key={k}>
                        <p style={{ fontSize:'0.6rem', color:'var(--text-muted)', marginBottom:'0.1rem' }}>{k}</p>
                        <p style={{ fontSize:'0.78rem', fontWeight:600, color: k==='Role'?'var(--gold)':'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v||'—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.625rem', marginTop:'0.25rem' }}>
                  <button type="button" onClick={()=>{setStep(1);setErrors({});}} className="btn-outline" style={{ flex:1, padding:'10px', borderRadius:'var(--radius-md)', fontSize:'0.8rem' }}>← Back</button>
                  <button type="submit" disabled={loading} className="btn-gold" style={{ flex:2, padding:'10px', borderRadius:'var(--radius-md)', fontSize:'0.85rem' }}>
                    {loading?<><Loader size={14} className="animate-spin-icon"/>Creating…</>:'Create My Account 🎵'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
