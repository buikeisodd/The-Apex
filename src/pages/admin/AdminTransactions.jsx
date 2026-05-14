import { useState } from 'react';
import { DollarSign, Zap, CheckCircle, Search, Bell, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const METHOD_ICONS = { card:'💳', paystack:'🏦', crypto:'₿', bank:'🏛️', flutterwave:'🦋' };
const TYPE_LABELS  = { booking_deposit:'Booking Deposit', booking_final:'Final Payment', booking_full:'Full Payment', beat_purchase:'Beat Purchase' };
const TYPE_COLORS  = { booking_deposit:'#eab308', booking_final:'#34C77B', booking_full:'#34C77B', beat_purchase:'#4A8FE8' };

function WebhookPanel({ nudges, onMarkRead, onMarkAll, onClose }) {
  return (
    <div className="animate-slideInRight" style={{ position:'fixed', top:68, right:0, width:360, height:'calc(100vh - 68px)', background:'var(--surface)', borderLeft:'1px solid rgba(255,255,255,0.07)', zIndex:90, overflowY:'auto', boxShadow:'var(--shadow-lg)' }}>
      <div style={{ padding:'1.25rem', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'var(--surface)', zIndex:1 }}>
        <div>
          <p style={{ fontFamily:'Bebas Neue', fontSize:'1.1rem', letterSpacing:'0.1em', color:'var(--gold)' }}>WEBHOOK EVENTS</p>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Secure payment notifications</p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
          {nudges.some(n=>!n.read) && (
            <button onClick={onMarkAll} style={{ fontSize:'0.7rem', color:'var(--gold)', background:'none', border:'1px solid rgba(212,168,67,0.3)', borderRadius:6, padding:'3px 8px', cursor:'pointer' }}>
              Mark all read
            </button>
          )}
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><X size={16}/></button>
        </div>
      </div>
      <div style={{ padding:'1rem' }}>
        {nudges.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--text-muted)' }}>
            <Zap size={32} style={{ margin:'0 auto 0.75rem', opacity:0.3, display:'block' }}/>
            <p style={{ fontSize:'0.85rem' }}>No webhook events yet</p>
          </div>
        ) : nudges.map(n => (
          <div key={n.id} onClick={() => onMarkRead(n.id)}
            style={{ padding:'1rem', borderRadius:'var(--radius-md)', background: n.read ? 'var(--surface2)' : 'rgba(212,168,67,0.07)', border:`1px solid ${n.read ? 'rgba(255,255,255,0.05)' : 'rgba(212,168,67,0.25)'}`, marginBottom:'0.625rem', cursor:'pointer', transition:'all 0.2s' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'0.625rem' }}>
              <div style={{ width:32, height:32, borderRadius:8, background: n.read ? 'var(--surface3)' : 'rgba(212,168,67,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Zap size={15} style={{ color: n.read ? 'var(--text-muted)' : 'var(--gold)' }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:'0.2rem' }}>
                  <p style={{ fontSize:'0.72rem', fontFamily:'DM Mono', color: n.read ? 'var(--text-muted)' : 'var(--gold)', fontWeight:600 }}>{n.event}</p>
                  {!n.read && <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)', display:'inline-block' }}/>}
                </div>
                <p style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--text)', marginBottom:'0.15rem' }}>${n.amount} from {n.from}</p>
                <p style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{METHOD_ICONS[n.method]||'💰'} {n.method} · {new Date(n.time).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminTransactions() {
  const { transactions, webhookNudges, markNudgeRead, markAllNudgesRead } = useApp();
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState('all');
  const [showWebhook, setShowWebhook] = useState(false);

  const unreadNudges = webhookNudges.filter(n => !n.read).length;

  const filtered = transactions
    .filter(t => typeFilter === 'all' || t.type === typeFilter)
    .filter(t => t.from.toLowerCase().includes(search.toLowerCase()) || t.to.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue  = transactions.reduce((s,t) => s + t.amount, 0).toFixed(2);
  const totalCount    = transactions.length;
  const methodBreakdown = ['card','paystack','crypto','bank'].map(m => ({ method:m, count:transactions.filter(t=>t.method===m).length, total:transactions.filter(t=>t.method===m).reduce((s,t)=>s+t.amount,0).toFixed(2) }));

  return (
    <div style={{ paddingTop:68, minHeight:'100vh' }}>
      <div style={{ background:'var(--bg-raised)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'3rem 1.5rem 2.25rem' }}>
        <div className="container">
          <span className="section-label" style={{ marginBottom:'1rem', display:'inline-flex', color:'#F04040' }}>Admin · Transactions</span>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <h1 className="font-display" style={{ fontFamily:'Bebas Neue', fontSize:'clamp(2rem, 5vw, 3.5rem)', letterSpacing:'0.05em', lineHeight:0.92, marginBottom:'0.5rem' }}>
                TRANSACTION <span className="gold-text">HISTORY</span>
              </h1>
              <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>All payments processed through Apex Label</p>
            </div>
            {/* Webhook nudge button */}
            <button onClick={() => setShowWebhook(!showWebhook)}
              style={{ position:'relative', display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:'var(--radius-md)', background: unreadNudges > 0 ? 'rgba(212,168,67,0.12)' : 'var(--surface)', border:`1px solid ${unreadNudges>0?'rgba(212,168,67,0.4)':'rgba(255,255,255,0.08)'}`, color: unreadNudges>0?'var(--gold)':'var(--text-muted)', cursor:'pointer', fontWeight:700, fontSize:'0.82rem', transition:'all 0.2s' }}>
              <Zap size={16}/> Webhook Events
              {unreadNudges > 0 && (
                <span style={{ background:'var(--gold)', color:'#000', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:800 }}>{unreadNudges}</span>
              )}
            </button>
          </div>

          {/* KPI row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'1rem', marginTop:'1.75rem' }}>
            <div className="card" style={{ borderRadius:'var(--radius-lg)', padding:'1rem', textAlign:'center' }}>
              <p style={{ fontFamily:'Bebas Neue', fontSize:'1.8rem', color:'var(--gold)' }}>${totalRevenue}</p>
              <p style={{ fontSize:'0.68rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Total Processed</p>
            </div>
            <div className="card" style={{ borderRadius:'var(--radius-lg)', padding:'1rem', textAlign:'center' }}>
              <p style={{ fontFamily:'Bebas Neue', fontSize:'1.8rem', color:'#34C77B' }}>{totalCount}</p>
              <p style={{ fontSize:'0.68rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Transactions</p>
            </div>
            {methodBreakdown.filter(m=>m.count>0).map(m => (
              <div key={m.method} className="card" style={{ borderRadius:'var(--radius-lg)', padding:'1rem', textAlign:'center' }}>
                <p style={{ fontFamily:'Bebas Neue', fontSize:'1.8rem', color:'var(--gold)' }}>${m.total}</p>
                <p style={{ fontSize:'0.68rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{METHOD_ICONS[m.method]} {m.method}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem 4rem' }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'1.5rem', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
            <input className="input-dark" style={{ paddingLeft:36, paddingRight:12, paddingTop:9, paddingBottom:9, borderRadius:'var(--radius-md)', fontSize:'0.85rem' }} placeholder="Search by name or description…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
            {['all','booking_deposit','booking_final','booking_full','beat_purchase'].map(f => (
              <button key={f} onClick={()=>setTypeFilter(f)}
                style={{ padding:'7px 13px', borderRadius:20, fontSize:'0.72rem', fontWeight:600, cursor:'pointer', background: typeFilter===f ? 'var(--gold)':'var(--surface2)', color: typeFilter===f ? '#000':'var(--text-muted)', border: typeFilter===f ? 'none':'1px solid rgba(255,255,255,0.07)', transition:'all 0.15s' }}>
                {f==='all' ? 'All' : TYPE_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ borderRadius:'var(--radius-xl)', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['ID','Type','From','To','Method','Amount','Status','Date','Webhook'].map(h => (
                    <th key={h} style={{ padding:'0.875rem 1rem', textAlign:'left', fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding:'3rem', textAlign:'center', color:'var(--text-muted)' }}>No transactions found</td></tr>
                ) : filtered.map((t,i) => (
                  <tr key={t.id} className="table-row-hover" style={{ borderBottom: i<filtered.length-1 ? '1px solid rgba(255,255,255,0.04)':'none' }}>
                    <td style={{ padding:'0.875rem 1rem', fontFamily:'DM Mono', fontSize:'0.7rem', color:'var(--text-muted)' }}>{t.id}</td>
                    <td style={{ padding:'0.875rem 1rem' }}>
                      <span style={{ fontSize:'0.65rem', padding:'3px 8px', borderRadius:4, background:`${TYPE_COLORS[t.type]}15`, color:TYPE_COLORS[t.type], border:`1px solid ${TYPE_COLORS[t.type]}30`, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>
                        {TYPE_LABELS[t.type]}
                      </span>
                    </td>
                    <td style={{ padding:'0.875rem 1rem', fontSize:'0.85rem', fontWeight:600 }}>{t.from}</td>
                    <td style={{ padding:'0.875rem 1rem', fontSize:'0.85rem', color:'var(--text-muted)' }}>{t.to}</td>
                    <td style={{ padding:'0.875rem 1rem', fontSize:'0.85rem' }}>{METHOD_ICONS[t.method]||'💰'} <span style={{ fontFamily:'DM Mono', fontSize:'0.75rem', color:'var(--text-muted)' }}>{t.method}</span></td>
                    <td style={{ padding:'0.875rem 1rem', fontFamily:'DM Mono', fontSize:'0.9rem', color:'var(--gold)', fontWeight:700 }}>${t.amount}</td>
                    <td style={{ padding:'0.875rem 1rem' }}>
                      <span style={{ fontSize:'0.65rem', padding:'3px 8px', borderRadius:4, background:'rgba(52,199,123,0.12)', color:'#34C77B', border:'1px solid rgba(52,199,123,0.25)', fontWeight:700, display:'flex', alignItems:'center', gap:4, width:'fit-content' }}>
                        <CheckCircle size={10}/> {t.status}
                      </span>
                    </td>
                    <td style={{ padding:'0.875rem 1rem', fontFamily:'DM Mono', fontSize:'0.72rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                      {new Date(t.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit'})}
                    </td>
                    <td style={{ padding:'0.875rem 1rem' }}>
                      <span style={{ fontSize:'0.62rem', padding:'2px 7px', borderRadius:4, background:'rgba(74,143,232,0.12)', color:'#4A8FE8', border:'1px solid rgba(74,143,232,0.25)', fontWeight:700, display:'flex', alignItems:'center', gap:3, width:'fit-content', whiteSpace:'nowrap' }}>
                        <Zap size={9}/> {t.webhook}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{ marginTop:'0.875rem', fontSize:'0.75rem', color:'var(--text-muted)' }}>{filtered.length} transaction{filtered.length!==1?'s':''}</p>
      </div>

      {showWebhook && (
        <WebhookPanel nudges={webhookNudges} onMarkRead={markNudgeRead} onMarkAll={markAllNudgesRead} onClose={() => setShowWebhook(false)} />
      )}
    </div>
  );
}
