import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ArrowRight, Star, Truck, RotateCcw, Shield, Headphones, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../lib/api';
import Loader from '../components/ui/Loader';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CATEGORIES = [
  { name: 'Sarees', slug: 'sarees', emoji: '🥻', desc: 'Timeless Grace', color: '#7B1C2E' },
  { name: 'Kurti', slug: 'kurti', emoji: '👘', desc: 'Everyday Elegance', color: '#C6973F' },
  { name: 'Gowns', slug: 'gowns', emoji: '👗', desc: 'Grand Occasions', color: '#9E2438' },
  { name: 'Kurta Sets', slug: 'top-bottom-set', emoji: '✨', desc: 'Coordinated Style', color: '#6B4F4F' },
  { name: 'Lenghas', slug: 'lenghas', emoji: '🌸', desc: 'Festive Splendour', color: '#C6973F' },
  { name: 'Jumpsuits', slug: 'jumpsuits', emoji: '💫', desc: 'Modern Fusion', color: '#7B1C2E' },
];

const HERO_SLIDES = [
  {
    title: 'New Festive Collection 2024',
    subtitle: 'Celebrate every occasion in unmatched elegance',
    cta: 'Shop Now',
    ctaLink: '/shop/sarees',
    gradient: 'linear-gradient(135deg, #7B1C2E 0%, #9E2438 50%, #C6973F 100%)',
  },
  {
    title: 'Summer Kurti Collection',
    subtitle: 'Fresh prints, breathable fabrics, timeless style',
    cta: 'Explore Kurtis',
    ctaLink: '/shop/kurti',
    gradient: 'linear-gradient(135deg, #C6973F 0%, #D4A955 60%, #F2A7C3 100%)',
  },
  {
    title: 'Party Wear Gowns',
    subtitle: 'Be the showstopper at every celebration',
    cta: 'View Gowns',
    ctaLink: '/shop/gowns',
    gradient: 'linear-gradient(135deg, #5C1522 0%, #7B1C2E 70%, #9E2438 100%)',
  },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'Absolutely stunning sarees! The quality is exceptional and delivery was super fast. Will definitely order again.' },
  { name: 'Ananya Patel', city: 'Ahmedabad', rating: 5, text: 'The kurti I ordered fits perfectly. The fabric is so soft and the colors are exactly as shown. Highly recommend!' },
  { name: 'Kavya Mehta', city: 'Surat', rating: 5, text: 'Bought a lehenga for my sister\'s wedding. Everyone loved it! Great quality at a very reasonable price.' },
  { name: 'Ritu Joshi', city: 'Jaipur', rating: 5, text: 'My go-to store for ethnic wear. The variety is amazing and customer service is wonderful.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [f, n, b] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?newArrival=true&limit=8'),
          api.get('/products?bestSeller=true&limit=8'),
        ]);
        setFeatured(f.data.products);
        setNewArrivals(n.data.products);
        setBestSellers(b.data.products);
      } catch (e) {
        // Use demo data if server not connected
        const demo = Array.from({ length: 4 }, (_, i) => ({
          _id: String(i), name: `Demo Product ${i + 1}`, slug: `demo-${i}`,
          category: CATEGORIES[i % CATEGORIES.length].slug, price: 1999 + i * 500,
          discountPrice: 1499 + i * 400, discountPercent: 25,
          images: [], ratings: { average: 4.5, count: 120 },
          colors: [{ name: 'Red', hex: '#7B1C2E' }, { name: 'Gold', hex: '#C6973F' }],
          sizes: ['S', 'M', 'L', 'XL'], isNewArrival: true, isBestSeller: true,
        }));
        setFeatured(demo); setNewArrivals(demo); setBestSellers(demo);
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Shree Vastra – Elegance in Every Thread | Women's Ethnic Wear</title>
        <meta name="description" content="Shop premium women's ethnic wear – sarees, kurtis, gowns, lenghas & more. Explore Shree Vastra's exclusive collections with free shipping above ₹999." />
      </Helmet>

      {/* ── Hero Slider ── */}
      <section aria-label="Featured Collections">
        <Swiper modules={[Autoplay, Pagination, Navigation]} autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }} navigation loop style={{ minHeight: '85vh' }}>
          {HERO_SLIDES.map((slide, i) => (
            <SwiperSlide key={i}>
              <div style={{ background: slide.gradient, minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative pattern */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div style={{ textAlign: 'center', color: 'white', padding: '40px 20px', position: 'relative', zIndex: 1, maxWidth: '700px' }}>
                  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 20px', borderRadius: '20px', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
                    New Collection
                  </div>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2, textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
                    {slide.title}
                  </h1>
                  <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', opacity: 0.9, marginBottom: '40px', fontStyle: 'italic' }}>
                    {slide.subtitle}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to={slide.ctaLink} style={{ background: 'white', color: 'var(--color-primary)', padding: '14px 36px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                      {slide.cta} <ArrowRight size={16} />
                    </Link>
                    <Link to="/shop" style={{ background: 'transparent', color: 'white', padding: '14px 36px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem', border: '2px solid rgba(255,255,255,0.7)', transition: 'all 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
                      View All
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── Trust Badges ── */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0', maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          {[
            { Icon: Truck, title: 'Free Shipping', sub: 'Orders above ₹999' },
            { Icon: RotateCcw, title: 'Easy Returns', sub: '7-day return policy' },
            { Icon: Shield, title: 'Secure Payment', sub: 'SSL encrypted checkout' },
            { Icon: Headphones, title: '24/7 Support', sub: 'Always here for you' },
          ].map(({ Icon, title, sub }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 24px', borderRight: '1px solid var(--color-border)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color="var(--color-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Explore our curated collection of women's ethnic wear</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} to={`/shop/${cat.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '32px 16px', textAlign: 'center', border: '2px solid transparent', boxShadow: 'var(--shadow-soft)', transition: 'all 0.3s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-soft)'; }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.emoji}</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '4px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: '20px 20px 80px', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--color-primary)' }}>Featured Collection</h2>
            <Link to="/shop?featured=true" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>View All <ChevronRight size={16} /></Link>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '40px' }}>Handpicked pieces for the discerning woman</p>
          {loading ? <Loader /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary), #9E2438)', padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(198,151,63,0.3)', border: '1px solid var(--color-accent)', padding: '6px 20px', borderRadius: '20px', color: 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Limited Time Offer
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', marginBottom: '16px' }}>Flat 30% Off</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '8px' }}>On all festive collections — Use code:</p>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '10px 24px', borderRadius: '8px', color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '0.1em', border: '1px dashed var(--color-accent)', marginBottom: '32px' }}>
            FESTIVE30
          </div>
          <br />
          <Link to="/shop" className="btn-accent" style={{ fontSize: '1rem', padding: '14px 40px', textDecoration: 'none' }}>
            Shop the Sale <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--color-primary)' }}>New Arrivals</h2>
            <Link to="/shop?newArrival=true" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>View All <ChevronRight size={16} /></Link>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: '40px' }}>Fresh from our design studios — just landed</p>
          {loading ? <Loader /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
              {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section style={{ padding: '20px 20px 80px', background: 'var(--color-cream-dark)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">Customer favourites — loved by thousands</p>
          {loading ? <Loader /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
              {bestSellers.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/shop" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 48px', textDecoration: 'none' }}>
              Browse All Collections <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Join thousands of happy customers across India</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: 'var(--color-cream)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--color-border)', position: 'relative' }}>
                <div style={{ fontSize: '2rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: '12px' }}>"</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-text)', marginBottom: '20px', fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.city}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={12} fill="var(--color-accent)" color="var(--color-accent)" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
