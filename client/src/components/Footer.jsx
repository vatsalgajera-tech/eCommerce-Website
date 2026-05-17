import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, Heart, Share2, Tv2, Camera } from 'lucide-react';

const categories = ['Sarees', 'Kurti', 'Kurta', 'Dresses', 'Dupatta', 'Tops & Tunics', 'Gowns', 'Lenghas'];
const quickLinks = [
  { to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact Us' },
  { to: '/blog', label: 'Fashion Blog' }, { to: '/size-guide', label: 'Size Guide' },
  { to: '/track-order', label: 'Track Order' }, { to: '/faq', label: 'FAQs' },
];
const policies = [
  { to: '/shipping-policy', label: 'Shipping Policy' }, { to: '/return-policy', label: 'Return & Refund' },
  { to: '/privacy-policy', label: 'Privacy Policy' }, { to: '/terms', label: 'Terms & Conditions' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-primary)', color: 'rgba(255,255,255,0.9)', marginTop: 'auto' }}>
      {/* Newsletter */}
      <div style={{ background: 'var(--color-accent)', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'white', marginBottom: '8px' }}>
            Join Our World of Elegance
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Subscribe for exclusive offers, new arrivals & fashion inspiration.
          </p>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input id="newsletter-email" type="email" placeholder="Enter your email address" required
              style={{ flex: 1, minWidth: '240px', padding: '12px 20px', borderRadius: '8px', border: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
            <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
              Subscribe ✨
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 20px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
        {/* Brand */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>Shree Vastra</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Elegance in Every Thread</div>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', marginBottom: '24px' }}>
            Your destination for premium women's ethnic wear. From timeless sarees to modern kurtis, we bring you the finest in Indian fashion.
          </p>
          {/* Social */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { Icon: Camera, href: 'https://instagram.com', color: '#E1306C', label: 'Instagram' },
              { Icon: Share2, href: 'https://facebook.com', color: '#1877F2', label: 'Facebook' },
              { Icon: Tv2, href: 'https://youtube.com', color: '#FF0000', label: 'YouTube' },
              { Icon: MessageCircle, href: 'https://wa.me/919723140922', color: '#25D366', label: 'WhatsApp' },
            ].map(({ Icon, href, color, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', textDecoration: 'none', color: 'white' }}
                onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 style={footerHeading}>Shop</h4>
          <ul style={{ listStyle: 'none' }}>
            {categories.map(c => (
              <li key={c} style={{ marginBottom: '10px' }}>
                <Link to={`/shop/${c.toLowerCase().replace(/[^a-z]+/g, '-')}`} style={footerLink}>{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={footerHeading}>Quick Links</h4>
          <ul style={{ listStyle: 'none' }}>
            {quickLinks.map(l => (
              <li key={l.to} style={{ marginBottom: '10px' }}>
                <Link to={l.to} style={footerLink}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies & Contact */}
        <div>
          <h4 style={footerHeading}>Policies</h4>
          <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
            {policies.map(p => (
              <li key={p.to} style={{ marginBottom: '10px' }}>
                <Link to={p.to} style={footerLink}>{p.label}</Link>
              </li>
            ))}
          </ul>
          <h4 style={footerHeading}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[{ Icon: Phone, text: '+91 97231 40922' }, { Icon: Mail, text: 'support.shreevastra@gmail.com' }, { Icon: MapPin, text: 'Rajkot, Gujarat, India' }].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)' }}>
                <Icon size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} /> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
        © {new Date().getFullYear()} Shree Vastra. All rights reserved. Made with <Heart size={12} style={{ display: 'inline', color: 'var(--color-pink)', verticalAlign: 'middle' }} /> in India.
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {['Visa', 'Mastercard', 'UPI', 'Razorpay', 'COD'].map(p => (
            <span key={p} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '4px', fontSize: '0.75rem' }}>{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

const footerHeading = { fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '18px', letterSpacing: '0.02em' };
const footerLink = { color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s', display: 'block' };
