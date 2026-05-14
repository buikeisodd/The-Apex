import { useState, useRef } from 'react';
import { Upload, Music, X, CheckCircle, CloudUpload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { genres } from '../data';

export default function UploadPage() {
  const { showToast } = useApp();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({
    title: '', genre: '', bpm: '', key: '', price: '', exclusive: '', tags: '',
  });

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.includes('audio') && !f.name.endsWith('.mp3') && !f.name.endsWith('.wav')) {
      showToast('Please upload an MP3 or WAV file', 'error'); return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) { showToast('Please attach an audio file', 'error'); return; }
    if (!form.title || !form.genre || !form.bpm || !form.price) { showToast('Fill in all required fields', 'error'); return; }
    setUploading(true);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12;
      if (p >= 100) { p = 100; clearInterval(iv); setUploading(false); setDone(true); showToast(`"${form.title}" uploaded successfully!`); }
      setProgress(Math.min(p, 100));
    }, 200);
  };

  if (done) return (
    <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <CheckCircle size={56} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>BEAT UPLOADED!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>"{form.title}" is now live in the beat store after review.</p>
        <button onClick={() => { setDone(false); setFile(null); setProgress(0); setForm({ title: '', genre: '', bpm: '', key: '', price: '', exclusive: '', tags: '' }); }}
          className="btn-gold px-8 py-3 rounded-xl text-sm">Upload Another</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span className="tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>Producer Portal</span>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '0.05em' }}>
            UPLOAD <span className="gold-text">BEAT</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <form onSubmit={handleSubmit}>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileRef.current.click()}
            style={{
              border: `2px dashed ${dragging ? 'var(--gold)' : file ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 16, padding: '3rem', textAlign: 'center', cursor: file ? 'default' : 'pointer',
              background: dragging ? 'rgba(201,168,76,0.05)' : 'var(--surface)', transition: 'all 0.2s',
              marginBottom: '2rem',
            }}>
            <input ref={fileRef} type="file" accept=".mp3,.wav,audio/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Music size={24} style={{ color: 'var(--gold)' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: 700, marginBottom: 2 }}>{file.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <CloudUpload size={48} style={{ color: 'var(--gold)', margin: '0 auto 1rem', opacity: 0.6 }} />
                <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Drop your beat here or click to browse</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports MP3, WAV · Max 100MB</p>
              </>
            )}
          </div>

          {/* Upload progress */}
          {uploading && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Uploading…</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono' }}>{Math.round(progress)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Form fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="upload-grid">
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Beat Title *</label>
              <input className="input-dark rounded-xl px-4 py-3 text-sm" placeholder="e.g. Midnight Throne" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Genre *</label>
              <select className="input-dark rounded-xl px-4 py-3 text-sm" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} required style={{ cursor: 'pointer' }}>
                <option value="">Select genre</option>
                {genres.filter(g => g !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>BPM *</label>
              <input className="input-dark rounded-xl px-4 py-3 text-sm font-mono-dm" placeholder="e.g. 140" type="number" min="60" max="200" value={form.bpm} onChange={e => setForm(f => ({ ...f, bpm: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Key</label>
              <input className="input-dark rounded-xl px-4 py-3 text-sm" placeholder="e.g. F# Minor" value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Lease Price ($) *</label>
              <input className="input-dark rounded-xl px-4 py-3 text-sm font-mono-dm" placeholder="e.g. 29.99" type="number" step="0.01" min="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Exclusive Price ($)</label>
              <input className="input-dark rounded-xl px-4 py-3 text-sm font-mono-dm" placeholder="e.g. 149.99" type="number" step="0.01" min="1" value={form.exclusive} onChange={e => setForm(f => ({ ...f, exclusive: e.target.value }))} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Tags <span style={{ fontWeight: 400 }}>(comma separated)</span></label>
            <input className="input-dark rounded-xl px-4 py-3 text-sm" placeholder="e.g. dark, cinematic, heavy" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>

          <button type="submit" disabled={uploading} className="btn-gold px-10 py-4 rounded-xl text-sm flex items-center gap-2">
            <Upload size={16} /> {uploading ? `Uploading ${Math.round(progress)}%…` : 'Publish Beat'}
          </button>
        </form>
      </div>

      <style>{`@media (max-width: 640px) { .upload-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
