import AccountLayout from '../../components/AccountLayout';
import { useSelector } from 'react-redux';
import { selectWishlist } from '../../store/slices/wishlistSlice';
import ProductCard from '../../components/ProductCard';
export default function AccountWishlist() {
  const items = useSelector(selectWishlist);
  return <AccountLayout><div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-soft)' }}><h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '20px' }}>My Wishlist ({items.length})</h2>{items.length === 0 ? <p style={{ color: 'var(--color-text-muted)' }}>No saved items.</p> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>{items.map(p => <ProductCard key={p._id} product={p} />)}</div>}</div></AccountLayout>;
}
