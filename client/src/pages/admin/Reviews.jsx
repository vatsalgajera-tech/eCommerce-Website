import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { api.get('/admin/reviews').catch(() => setReviews([])); }, []);
  return (
    <AdminLayout title="Reviews">
      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-soft)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '16px' }}>Review Moderation</h2>
        {reviews.length === 0 ? <p style={{ color: 'var(--color-text-muted)' }}>No pending reviews.</p> : reviews.map(r => (
          <div key={r._id} style={{ padding: '16px 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontWeight: 600 }}>{r.title}</div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{r.body}</div></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: '#D1FAE5', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#059669' }}><Check size={16} /></button>
              <button style={{ background: '#FEE2E2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#DC2626' }}><X size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
