import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { Star, Check, X, Trash2 } from 'lucide-react';

function Stars({ value }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i<=value?'var(--color-accent)':'none'} color="var(--color-accent)"/>)}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    const q = filter === 'all' ? '' : `?approved=${filter === 'approved'}`;
    api.get(`/reviews/admin${q}`).then(r => setReviews(r.data.reviews||[])).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{ setLoading(true); load(); },[filter]);

  const toggle = async (id) => {
    try {
      const { data } = await api.put(`/reviews/admin/${id}/approve`);
      setReviews(rs => rs.map(r => r._id===id ? {...r, isApproved: data.isApproved} : r));
      toast.success(data.isApproved ? 'Review approved ✅' : 'Review hidden');
    } catch { toast.error('Failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      setReviews(rs => rs.filter(r => r._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const statusStyle = (approved) => ({
    background: approved ? '#D1FAE5' : '#FEF3C7',
    color: approved ? '#065F46' : '#92400E',
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
  });

  return (
    <AdminLayout>
      <div style={{ padding: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.8rem', marginBottom: '24px' }}>Customer Reviews</h1>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {['all','pending','approved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid', borderColor: filter===f ? 'var(--color-primary)' : 'var(--color-border)', background: filter===f ? 'var(--color-primary)' : 'white', color: filter===f ? 'white' : 'var(--color-text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <Loader/> : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>No reviews found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map(r => (
              <div key={r._id} style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow-soft)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <img src={r.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80'} alt=""
                  style={{ width: '56px', height: '70px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.product?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>by {r.user?.name} ({r.user?.email})</div>
                    </div>
                    <span style={statusStyle(r.isApproved)}>{r.isApproved ? 'Approved' : 'Pending'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
                    <Stars value={r.rating}/>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.rating}/5</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  {r.title && <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>{r.title}</div>}
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>{r.body}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => toggle(r._id)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid', borderColor: r.isApproved ? '#FCA5A5' : '#6EE7B7', background: r.isApproved ? '#FEF2F2' : '#F0FDF4', color: r.isApproved ? '#DC2626' : '#059669', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {r.isApproved ? <><X size={12}/> Reject</> : <><Check size={12}/> Approve</>}
                  </button>
                  <button onClick={() => del(r._id)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Trash2 size={12}/> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
