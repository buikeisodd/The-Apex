import { useState } from 'react';
import { Play, Pause, ShoppingCart, Heart, Headphones, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BeatCard({ beat, onBuyNow }) {
  const { addToCart, toggleSaved, saved, user } = useApp();
  const [playing,  setPlaying]  = useState(false);
  const [liked,    setLiked]    = useState(false);
  const [progress, setProgress] = useState(0);

  const isSaved = saved.find(b => b.id === beat.id);
  const hues    = [42,200,280,160,340,20];
  const hue     = hues[beat.id % hues.length];

  const togglePlay = () => {
    if (!playing) {
      setPlaying(true);
      let p = 0;
      const iv = setInterval(() => {
        p += 0.8; setProgress(p);
        if (p >= 100) { clearInterval(iv); setPlaying(false); setProgress(0); }
      }, 120);
    } else { setPlaying(false); setProgress(0); }
  };

  return (
    <div className="card" style={{ borderRadius:'var(--radius-xl)', overflow:'hidden' }}>
      {/* Cover */}
      <div style={{ position:'relative', aspectRatio:'16/9', background:`linear-gradient(145deg, hsl(${hue},30%,10%) 0%, hsl(${hue+40},20%,6%) 100%)`, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:180, height:180, borderRadius:'50%', border:`1px solid hsl(${hue},60%,50%)`, opacity:0.08 }}/>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:120, height:120, borderRadius:'50%', border:`1px solid hsl(${hue},60%,60%)`, opacity:0.12 }}/>

        <div style={{ position:'absolute', top:10, left:10 }}><span className="tag">{beat.genre}</span></div>

        {/* Like + Save buttons */}
        <div style={{ position:'absolute', top:8, right:8, display:'flex', gap:5 }}>
          {/* Save to wishlist */}
          <button onClick={() => toggleSaved(beat)}
            style={{ background:'rgba(0,0,0,0.5)', border:'none', cursor:'pointer', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            title={isSaved ? 'Remove from saved' : 'Save for later'}>
            <Bookmark size={13} style={{ color: isSaved ? 'var(--gold)' : 'rgba(255,255,255,0.6)', fill: isSaved ? 'var(--gold)' : 'none', transition:'all 0.2s' }}/>
          </button>
          {/* Like */}
          <button onClick={() => setLiked(!liked)}
            style={{ background:'rgba(0,0,0,0.5)', border:'none', cursor:'pointer', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
            <Heart size={13} style={{ color: liked ? '#F04040':'rgba(255,255,255,0.6)', fill: liked ? '#F04040':'none', transition:'all 0.2s' }}/>
          </button>
        </div>

        <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', padding:'3px 9px', borderRadius:4, fontSize:'0.63rem', fontFamily:'DM Mono', color:'var(--gold)', letterSpacing:'0.08em', border:'1px solid rgba(255,255,255,0.06)' }}>
          {beat.bpm} BPM · {beat.key}
        </div>

        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <button onClick={togglePlay}
            style={{ width:52, height:52, borderRadius:'50%', background:'rgba(212,168,67,0.92)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 24px rgba(0,0,0,0.5)', transition:'all 0.2s var(--ease-spring)' }}
            onMouseEnter={e => { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.boxShadow='var(--shadow-gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.5)'; }}>
            {playing ? <Pause size={20} style={{ color:'#000' }}/> : <Play size={20} style={{ color:'#000', marginLeft:2 }}/>}
          </button>
        </div>

        {playing && (
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:34, display:'flex', alignItems:'center', justifyContent:'center', gap:3, background:'linear-gradient(transparent, rgba(0,0,0,0.6))', paddingBottom:6 }}>
            {[...Array(16)].map((_,i) => <div key={i} className="wave-bar" style={{ animationDelay:`${i*0.07}s`, height:4 }}/>)}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:'1.25rem 1.25rem 1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
          <div style={{ minWidth:0, flex:1, paddingRight:'0.75rem' }}>
            <h3 style={{ fontSize:'0.95rem', fontWeight:700, marginBottom:'0.2rem', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{beat.title}</h3>
            <p style={{ fontSize:'0.73rem', color:'var(--text-muted)', fontFamily:'DM Mono' }}>{beat.producer}</p>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <p style={{ fontSize:'1.05rem', fontWeight:700, color:'var(--gold)' }}>${beat.price}</p>
            <p style={{ fontSize:'0.6rem', color:'var(--text-muted)' }}>lease</p>
          </div>
        </div>

        <div className="progress-track" style={{ marginBottom:'1rem' }}>
          <div className="progress-fill" style={{ width:`${progress}%` }}/>
        </div>

        <div style={{ display:'flex', gap:'0.375rem', marginBottom:'0.875rem', flexWrap:'wrap' }}>
          {beat.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:'1rem' }}>
          <Headphones size={12} style={{ color:'var(--text-muted)' }}/>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'DM Mono' }}>{beat.plays.toLocaleString()} plays · {beat.duration}</span>
          {isSaved && <span style={{ marginLeft:'auto', fontSize:'0.6rem', color:'var(--gold)', fontWeight:600, display:'flex', alignItems:'center', gap:3 }}><Bookmark size={10} fill="var(--gold)"/> Saved</span>}
        </div>

        <div style={{ display:'flex', gap:'0.625rem' }}>
          <button onClick={() => onBuyNow && onBuyNow(beat)} className="btn-gold" style={{ flex:1, padding:'10px', borderRadius:'var(--radius-md)', fontSize:'0.8rem' }}>
            Buy ${beat.price}
          </button>
          <button onClick={() => toggleSaved(beat)} title={isSaved ? 'Unsave':'Save for later'}
            style={{ padding:'10px 12px', borderRadius:'var(--radius-md)', background: isSaved ? 'rgba(212,168,67,0.15)':'var(--surface2)', border:`1px solid ${isSaved ? 'rgba(212,168,67,0.4)':'rgba(255,255,255,0.07)'}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
            <Bookmark size={15} style={{ color: isSaved ? 'var(--gold)':'var(--text-muted)', fill: isSaved ? 'var(--gold)':'none' }}/>
          </button>
          <button onClick={() => addToCart(beat)} className="btn-outline" style={{ padding:'10px 12px', borderRadius:'var(--radius-md)' }}>
            <ShoppingCart size={15}/>
          </button>
        </div>

        <p style={{ textAlign:'center', marginTop:'0.625rem', fontSize:'0.63rem', color:'var(--text-muted)' }}>
          Exclusive: <span style={{ color:'var(--gold)' }}>${beat.exclusive}</span>
        </p>
      </div>
    </div>
  );
}
