import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="toast" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
      {toast.type === 'success'
        ? <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }} />
        : <AlertCircle size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />
      }
      <span style={{ lineHeight: 1.55, color: 'var(--text)' }}>{toast.msg}</span>
    </div>
  );
}
