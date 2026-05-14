import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

// ── Themes ────────────────────────────────────────────────────────────────────
export const THEMES = {
  dark:    { name:'Dark Gold',    bg:'#060608', surface:'#12121A', surface2:'#1A1A24', surface3:'#22222E', gold:'#D4A843', text:'#F2EFE8', textMuted:'#6E6A60' },
  midnight:{ name:'Midnight',     bg:'#020410', surface:'#0A0E20', surface2:'#121628', surface3:'#1A1E32', gold:'#7C6FE8', text:'#E8E6FF', textMuted:'#5A5880' },
  forest:  { name:'Forest',       bg:'#030A06', surface:'#0A1610', surface2:'#111E18', surface3:'#182820', gold:'#4CAF72', text:'#E8F5EC', textMuted:'#4A7060' },
  crimson: { name:'Crimson',      bg:'#080406', surface:'#180A0E', surface2:'#220E14', surface3:'#2C121A', gold:'#E84C6A', text:'#F5E8EC', textMuted:'#7A4858' },
  ocean:   { name:'Ocean',        bg:'#020810', surface:'#081428', surface2:'#0E1E38', surface3:'#142848', gold:'#4A9FE8', text:'#E8F0FF', textMuted:'#486080' },
  light:   { name:'Light',        bg:'#F5F4F0', surface:'#FFFFFF', surface2:'#F0EDE8', surface3:'#E8E4DC', gold:'#B8860B', text:'#1A1816', textMuted:'#888070' },
};

const DEMO_USERS = [
  { id:'u-001', role:'client',   firstName:'Tunde',  lastName:'Adeyemi',   email:'tunde@gmail.com',   phone:'+234 801 234 5678', country:'Nigeria', city:'Lagos',         joinedAt:'2025-03-12T08:00:00Z', avatarType:'letter', avatarValue:'T', avatarColor:'#D4A843', provider:'Google', status:'active',  genre:'',          bio:'Afrobeats artist looking for fire beats.' },
  { id:'u-002', role:'client',   firstName:'Sade',   lastName:'Mensah',    email:'sade@icloud.com',   phone:'+233 244 567 890',  country:'Ghana',   city:'Accra',         joinedAt:'2025-03-20T10:30:00Z',avatarType:'letter', avatarValue:'S', avatarColor:'#8B5CF6', provider:'Apple',  status:'active',  genre:'',          bio:'R&B singer-songwriter.' },
  { id:'u-003', role:'client',   firstName:'Draco',  lastName:'Phiri',     email:'draco@gmail.com',   phone:'+265 888 112 233',  country:'Malawi',  city:'Lilongwe',      joinedAt:'2025-04-01T14:00:00Z',avatarType:'emoji',  avatarValue:'🎤',avatarColor:'#F04040', provider:'Email',  status:'active',  genre:'',          bio:'Drill rapper.' },
  { id:'u-004', role:'producer', firstName:'Sage',   lastName:'Beats',     email:'sage@apexlabel.ng', phone:'+234 803 111 2222', country:'Nigeria', city:'Abuja',         joinedAt:'2025-01-05T09:00:00Z',avatarType:'emoji',  avatarValue:'🎛️',avatarColor:'#D4A843', provider:'Email',  status:'active',  genre:'Trap/Drill',bio:'Multi-platinum producer. Known for dark cinematic beats.' },
  { id:'u-005', role:'producer', firstName:'Luxe',   lastName:'Audio',     email:'luxe@apexlabel.ng', phone:'+234 807 333 4444', country:'Nigeria', city:'Lagos',         joinedAt:'2025-01-10T11:00:00Z',avatarType:'letter', avatarValue:'L', avatarColor:'#34C77B', provider:'Google', status:'active',  genre:'Afrobeats', bio:'Afrobeats specialist. 10+ years in the game.' },
  { id:'u-006', role:'producer', firstName:'Wave',   lastName:'Craft',     email:'wave@apexlabel.ng', phone:'+234 809 555 6666', country:'Nigeria', city:'Port Harcourt', joinedAt:'2025-02-01T08:00:00Z',avatarType:'emoji',  avatarValue:'🌊',avatarColor:'#4A8FE8', provider:'Email',  status:'active',  genre:'R&B/Soul',  bio:'Smooth soul producer. Melodic and emotional beats.' },
  { id:'u-007', role:'client',   firstName:'Amara',  lastName:'Osei',      email:'amara@yahoo.com',   phone:'+233 200 987 654',  country:'Ghana',   city:'Kumasi',        joinedAt:'2025-04-15T12:00:00Z',avatarType:'letter', avatarValue:'A', avatarColor:'#E84C6A', provider:'Email',  status:'active',  genre:'',          bio:'Developing artist. R&B and Pop.' },
  { id:'u-008', role:'client',   firstName:'Kofi',   lastName:'Acheampong',email:'kofi@gmail.com',    phone:'+233 277 654 321',  country:'Ghana',   city:'Accra',         joinedAt:'2025-04-20T09:00:00Z',avatarType:'letter', avatarValue:'K', avatarColor:'#4A9FE8', provider:'Google', status:'suspended',genre:'',          bio:'' },
];

const DEMO_BOOKINGS = [
  { id:'bk-001', clientName:'Tunde Adeyemi',  clientEmail:'tunde@gmail.com', sessionType:'Recording Session',  duration:'3 hrs', date:'2025-05-20', time:'2:00 PM',  price:150, halfPaid:75,  paymentStatus:'half_paid', paymentMethod:'card',   notes:'Afrobeats style.',status:'pending',              assignedProducer:null,         createdAt:'2025-05-07T09:00:00Z' },
  { id:'bk-002', clientName:'Sade Mensah',    clientEmail:'sade@icloud.com', sessionType:'Mixing & Mastering',duration:'5 hrs', date:'2025-05-22', time:'10:00 AM', price:200, halfPaid:100, paymentStatus:'half_paid', paymentMethod:'paystack',notes:'',              status:'awaiting_confirmation', assignedProducer:'Sage Beats', createdAt:'2025-05-07T10:30:00Z' },
  { id:'bk-003', clientName:'Draco Phiri',    clientEmail:'draco@gmail.com', sessionType:'Beat Production',   duration:'4 hrs', date:'2025-05-24', time:'5:00 PM',  price:250, halfPaid:125, paymentStatus:'half_paid', paymentMethod:'crypto',  notes:'Dark drill.',   status:'pending',              assignedProducer:null,         createdAt:'2025-05-06T14:00:00Z' },
  { id:'bk-004', clientName:'Amara Osei',     clientEmail:'amara@yahoo.com', sessionType:'Artist Development',duration:'2 hrs', date:'2025-05-18', time:'11:00 AM', price:100, halfPaid:50,  paymentStatus:'full_paid', paymentMethod:'card',   notes:'First session.', status:'confirmed',            assignedProducer:'Luxe Audio', createdAt:'2025-05-05T08:00:00Z' },
  { id:'bk-005', clientName:'Kofi Acheampong',clientEmail:'kofi@gmail.com',  sessionType:'Recording Session', duration:'3 hrs', date:'2025-05-28', time:'6:00 PM',  price:150, halfPaid:75,  paymentStatus:'half_paid', paymentMethod:'bank',   notes:'',              status:'declined',             assignedProducer:'Wavecraft',  createdAt:'2025-05-04T11:00:00Z' },
  { id:'bk-006', clientName:'Funmi Balogun',  clientEmail:'funmi@gmail.com', sessionType:'Mixing & Mastering',duration:'5 hrs', date:'2025-06-01', time:'3:00 PM',  price:200, halfPaid:200, paymentStatus:'full_paid', paymentMethod:'paystack',notes:'EP mix.',        status:'completed',            assignedProducer:'Luxe Audio', createdAt:'2025-05-03T10:00:00Z' },
];

const DEMO_TRANSACTIONS = [
  { id:'tx-001', type:'booking_deposit', amount:75,  currency:'USD', from:'Tunde Adeyemi',  to:'Apex Label',  method:'card',    status:'success', bookingId:'bk-001', description:'50% deposit — Recording Session',  createdAt:'2025-05-07T09:05:00Z', webhook:'sent' },
  { id:'tx-002', type:'booking_deposit', amount:100, currency:'USD', from:'Sade Mensah',    to:'Apex Label',  method:'paystack',status:'success', bookingId:'bk-002', description:'50% deposit — Mixing & Mastering',  createdAt:'2025-05-07T10:35:00Z', webhook:'sent' },
  { id:'tx-003', type:'booking_deposit', amount:125, currency:'USD', from:'Draco Phiri',    to:'Apex Label',  method:'crypto',  status:'success', bookingId:'bk-003', description:'50% deposit — Beat Production',      createdAt:'2025-05-06T14:10:00Z', webhook:'sent' },
  { id:'tx-004', type:'booking_full',    amount:100, currency:'USD', from:'Amara Osei',     to:'Apex Label',  method:'card',    status:'success', bookingId:'bk-004', description:'Full payment — Artist Development',  createdAt:'2025-05-05T08:15:00Z', webhook:'sent' },
  { id:'tx-005', type:'booking_deposit', amount:75,  currency:'USD', from:'Kofi Acheampong',to:'Apex Label',  method:'bank',    status:'success', bookingId:'bk-005', description:'50% deposit — Recording Session',   createdAt:'2025-05-04T11:10:00Z', webhook:'sent' },
  { id:'tx-006', type:'booking_final',   amount:200, currency:'USD', from:'Funmi Balogun',  to:'Apex Label',  method:'paystack',status:'success', bookingId:'bk-006', description:'Final payment — Mixing & Mastering', createdAt:'2025-06-01T14:00:00Z', webhook:'sent' },
  { id:'tx-007', type:'beat_purchase',   amount:29.99,currency:'USD',from:'Tunde Adeyemi',  to:'Sage Beats',  method:'card',    status:'success', beatId:1,           description:'Lease — Midnight Throne',            createdAt:'2025-05-10T12:00:00Z', webhook:'sent' },
  { id:'tx-008', type:'beat_purchase',   amount:34.99,currency:'USD',from:'Draco Phiri',    to:'Wavecraft',   method:'paystack',status:'success', beatId:3,           description:'Lease — Neon Drift',                 createdAt:'2025-05-11T15:30:00Z', webhook:'sent' },
];

const DEMO_BEATS = [
  { id:1, title:'Midnight Throne', producer:'Sage Beats', genre:'Trap',     bpm:140, key:'F# Minor',price:29.99, exclusive:149.99, tags:['dark','cinematic'],plays:2847, duration:'2:34',status:'active'  },
  { id:2, title:'Golden Era',      producer:'Luxe Audio', genre:'Boom Bap', bpm:92,  key:'C Major', price:24.99, exclusive:119.99, tags:['classic','jazz'],  plays:5120, duration:'3:02',status:'active'  },
  { id:3, title:'Neon Drift',      producer:'Wavecraft',  genre:'Afrobeats',bpm:105, key:'A Minor', price:34.99, exclusive:179.99, tags:['afro','vibey'],    plays:8930, duration:'2:48',status:'active'  },
  { id:4, title:"Pharaoh's Code",  producer:'Sage Beats', genre:'Drill',    bpm:148, key:'D Minor', price:39.99, exclusive:199.99, tags:['drill','epic'],    plays:3412, duration:'2:22',status:'pending' },
  { id:5, title:'Lagos Nights',    producer:'Luxe Audio', genre:'Afrobeats',bpm:112, key:'G Major', price:29.99, exclusive:149.99, tags:['afro','Lagos'],    plays:12400,duration:'3:15',status:'active'  },
  { id:6, title:'Soul Circuit',    producer:'Wavecraft',  genre:'R&B',      bpm:88,  key:'Bb Major',price:24.99, exclusive:129.99, tags:['smooth','melodic'],plays:6780, duration:'2:58',status:'active'  },
];

const DEMO_NOTIFICATIONS = {
  'Sage Beats': [
    { id:9001, type:'assignment', bookingId:'bk-002', message:"You've been assigned to a Mixing & Mastering session for Sade Mensah on 2025-05-22 at 10:00 AM. Please confirm your availability.", read:false, producerResponse:null, createdAt:'2025-05-07T10:35:00Z' },
  ],
};

const PRODUCERS = ['Sage Beats','Luxe Audio','Wavecraft'];

export function AppProvider({ children }) {
  const [user,          setUser]          = useState(null);
  const [cart,          setCart]          = useState([]);
  const [saved,         setSaved]         = useState([]); // saved beats (wishlist)
  const [toast,         setToast]         = useState(null);
  const [bookings,      setBookings]      = useState(DEMO_BOOKINGS);
  const [beats,         setBeats]         = useState(DEMO_BEATS);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [users,         setUsers]         = useState(DEMO_USERS);
  const [transactions,  setTransactions]  = useState(DEMO_TRANSACTIONS);
  const [theme,         setTheme]         = useState('dark');
  const [webhookNudges, setWebhookNudges] = useState([]);

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const login  = useCallback((u) => setUser(u), []);
  const logout = useCallback(() => { setUser(null); setCart([]); setSaved([]); }, []);

  // ── Profile ───────────────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    setUsers(prev => prev.map(u => u.email === updates.email || u.id === updates.id ? { ...u, ...updates } : u));
    showToast('Profile updated!');
  }, [showToast]);

  const deleteAccount = useCallback(() => {
    setUser(null);
    setCart([]);
    setSaved([]);
    showToast('Account deleted. Sorry to see you go.', 'error');
  }, [showToast]);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const changeTheme = useCallback((t) => {
    setTheme(t);
    const th = THEMES[t];
    if (th) {
      const r = document.documentElement.style;
      r.setProperty('--bg', th.bg);
      r.setProperty('--surface', th.surface);
      r.setProperty('--surface2', th.surface2);
      r.setProperty('--surface3', th.surface3);
      r.setProperty('--gold', th.gold);
      r.setProperty('--text', th.text);
      r.setProperty('--text-muted', th.textMuted);
    }
  }, []);

  // ── Saved beats ────────────────────────────────────────────────────────────
  const toggleSaved = useCallback((beat) => {
    setSaved(prev => {
      const already = prev.find(b => b.id === beat.id);
      if (already) { showToast(`"${beat.title}" removed from saved`); return prev.filter(b => b.id !== beat.id); }
      showToast(`"${beat.title}" saved for later ⭐`);
      return [...prev, beat];
    });
  }, [showToast]);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const addToCart      = useCallback((beat) => { setCart(p => p.find(b=>b.id===beat.id)?p:[...p,beat]); showToast(`"${beat.title}" added to cart`); }, [showToast]);
  const removeFromCart = useCallback((id)   => setCart(p=>p.filter(b=>b.id!==id)), []);
  const clearCart      = useCallback(()     => setCart([]), []);

  // ── Users ─────────────────────────────────────────────────────────────────
  const registerUser = useCallback((data) => {
    const u = { ...data, id:`u-${Date.now()}`, joinedAt:new Date().toISOString(), status:'active', avatarType:'letter', avatarValue:data.firstName[0].toUpperCase(), avatarColor:'#D4A843' };
    setUsers(p=>[u,...p]);
    return u;
  }, []);

  const updateUserStatus = useCallback((id, status) => {
    setUsers(p=>p.map(u=>u.id===id?{...u,status}:u));
    showToast(status==='suspended'?'User suspended.':'User reactivated.');
  }, [showToast]);

  // ── Bookings ──────────────────────────────────────────────────────────────
  const addBooking = useCallback((data) => {
    const b = { ...data, id:`bk-${Date.now()}`, status:'pending', assignedProducer:null, createdAt:new Date().toISOString() };
    setBookings(p=>[b,...p]);
    // Record transaction (deposit)
    const tx = { id:`tx-${Date.now()}`, type:'booking_deposit', amount:data.halfPaid, currency:'USD', from:data.clientName, to:'Apex Label', method:data.paymentMethod, status:'success', bookingId:b.id, description:`50% deposit — ${data.sessionType}`, createdAt:new Date().toISOString(), webhook:'sent' };
    setTransactions(p=>[tx,...p]);
    // Webhook nudge
    setWebhookNudges(p=>[{ id:Date.now(), event:'booking.deposit.received', amount:data.halfPaid, from:data.clientName, method:data.paymentMethod, time:new Date().toISOString(), read:false },...p]);
    return b;
  }, []);

  const assignProducer = useCallback((bookingId, producerName) => {
    let booking = null;
    setBookings(p=>p.map(b=>{ if(b.id===bookingId){booking=b;return{...b,assignedProducer:producerName,status:'awaiting_confirmation'};}return b; }));
    setNotifications(prev=>({ ...prev, [producerName]:[ { id:Date.now(), type:'assignment', bookingId, message:`You've been assigned to a ${booking?.sessionType||'Session'} for ${booking?.clientName||'a client'} on ${booking?.date||''} at ${booking?.time||''}. Please confirm your availability.`, read:false, producerResponse:null, createdAt:new Date().toISOString() }, ...(prev[producerName]||[]) ] }));
    showToast(`Assigned to ${producerName} — awaiting confirmation.`);
  }, [showToast]);

  const confirmSession = useCallback((producerName, bookingId, notifId) => {
    setBookings(p=>p.map(b=>b.id===bookingId?{...b,status:'confirmed'}:b));
    setNotifications(prev=>({ ...prev, [producerName]:(prev[producerName]||[]).map(n=>n.id===notifId?{...n,read:true,producerResponse:'confirmed'}:n) }));
    showToast('Session confirmed! Client will be notified.');
  }, [showToast]);

  const declineSession = useCallback((producerName, bookingId, notifId) => {
    setBookings(p=>p.map(b=>b.id===bookingId?{...b,status:'declined',assignedProducer:producerName}:b));
    setNotifications(prev=>({ ...prev, [producerName]:(prev[producerName]||[]).map(n=>n.id===notifId?{...n,read:true,producerResponse:'declined'}:n) }));
    showToast('You declined the session. Admin will be notified.','error');
  }, [showToast]);

  const updateBookingStatus = useCallback((id, status) => { setBookings(p=>p.map(b=>b.id===id?{...b,status}:b)); }, []);

  const markNotificationRead = useCallback((producerName, notifId) => {
    setNotifications(prev=>({ ...prev, [producerName]:(prev[producerName]||[]).map(n=>n.id===notifId?{...n,read:true}:n) }));
  }, []);

  // ── Beats ─────────────────────────────────────────────────────────────────
  const addBeat     = useCallback((beat) => {
    setBeats(p=>[{...beat,id:Date.now(),plays:0,status:'pending'},...p]);
  }, []);
  const deleteBeat  = useCallback((id)   => { setBeats(p=>p.filter(b=>b.id!==id)); showToast('Beat deleted.'); }, [showToast]);
  const approveBeat = useCallback((id)   => { setBeats(p=>p.map(b=>b.id===id?{...b,status:'active'}:b)); showToast('Beat approved and live!'); }, [showToast]);

  // ── Beat purchase transaction ──────────────────────────────────────────────
  const recordBeatPurchase = useCallback((beat, method, buyerName) => {
    const tx = { id:`tx-${Date.now()}`, type:'beat_purchase', amount:beat.price, currency:'USD', from:buyerName||'Client', to:beat.producer, method, status:'success', beatId:beat.id, description:`Lease — ${beat.title}`, createdAt:new Date().toISOString(), webhook:'sent' };
    setTransactions(p=>[tx,...p]);
    setWebhookNudges(p=>[{ id:Date.now(), event:'beat.purchase.completed', amount:beat.price, from:buyerName||'Client', method, time:new Date().toISOString(), read:false },...p]);
  }, []);

  // ── Webhook nudges ────────────────────────────────────────────────────────
  const markNudgeRead = useCallback((id) => { setWebhookNudges(p=>p.map(n=>n.id===id?{...n,read:true}:n)); }, []);
  const markAllNudgesRead = useCallback(() => { setWebhookNudges(p=>p.map(n=>({...n,read:true}))); }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout, updateProfile, deleteAccount,
      cart, addToCart, removeFromCart, clearCart,
      saved, toggleSaved,
      toast, showToast,
      bookings, addBooking, assignProducer, updateBookingStatus, confirmSession, declineSession,
      beats, addBeat, deleteBeat, approveBeat,
      notifications, markNotificationRead,
      users, registerUser, updateUserStatus,
      transactions, recordBeatPurchase,
      webhookNudges, markNudgeRead, markAllNudgesRead,
      theme, changeTheme, THEMES,
      PRODUCERS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
