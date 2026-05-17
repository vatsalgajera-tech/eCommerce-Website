import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { Save, Store, Truck, Percent, Bell } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Shree Vastra',
    tagline: 'Elegance in Every Thread',
    contactEmail: 'shreevastrastore@gmail.com',
    contactPhone: '+91 97231 40922',
    address: 'Rajkot, Gujarat, India',
    freeShippingThreshold: 999,
    standardShipping: 99,
    expressShipping: 199,
    gstPercent: 5,
    announcementBar: 'Free shipping on orders above ₹999! Use code FESTIVE30 for 30% off.',
    announcementActive: true,
    currency: 'INR',
    currencySymbol: '₹',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // In a full implementation, POST /api/admin/settings
    await new Promise(r => setTimeout(r, 800));
    toast.success('Settings saved! ✅');
    setSaving(false);
  };

  const section = (title, icon, children) => (
    <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-soft)', marginBottom: '20px' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon} {title}
      </h3>
      {children}
    </div>
  );

  const field = (label, key, type = 'text', hint = '') => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>{label}</label>
      <input type={type} value={settings[key]} onChange={e => set(key, type==='number' ? Number(e.target.value) : e.target.value)}
        style={{ width: '100%', padding: '11px 16px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor='var(--color-primary)'}
        onBlur={e => e.target.style.borderColor='var(--color-border)'}/>
      {hint && <p style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{hint}</p>}
    </div>
  );

  return (
    <AdminLayout>
      <div style={{ padding: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.8rem', marginBottom: '24px' }}>Store Settings</h1>
        <form onSubmit={handleSave}>
          {section('Store Information', <Store size={18}/>, (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1/-1' }}>{field('Store Name', 'storeName')}</div>
              <div style={{ gridColumn: '1/-1' }}>{field('Tagline', 'tagline')}</div>
              {field('Contact Email', 'contactEmail', 'email')}
              {field('Contact Phone', 'contactPhone')}
              <div style={{ gridColumn: '1/-1' }}>{field('Address', 'address')}</div>
            </div>
          ))}

          {section('Shipping & Pricing', <Truck size={18}/>, (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              {field('Free Shipping Above (₹)', 'freeShippingThreshold', 'number', 'Orders above this get free shipping')}
              {field('Standard Shipping (₹)', 'standardShipping', 'number')}
              {field('Express Shipping (₹)', 'expressShipping', 'number')}
            </div>
          ))}

          {section('Tax Settings', <Percent size={18}/>, (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {field('GST %', 'gstPercent', 'number', 'Applied on product subtotal')}
              {field('Currency Symbol', 'currencySymbol')}
            </div>
          ))}

          {section('Announcement Bar', <Bell size={18}/>, (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>Announcement Text</label>
                <textarea value={settings.announcementBar} onChange={e => set('announcementBar', e.target.value)} rows={2}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}/>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={settings.announcementActive} onChange={e => set('announcementActive', e.target.checked)} style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}/>
                Show announcement bar on site
              </label>
            </div>
          ))}

          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '14px 40px', fontSize: '1rem', opacity: saving ? 0.7 : 1 }}>
            <Save size={18}/> {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
