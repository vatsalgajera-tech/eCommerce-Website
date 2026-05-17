export default function Loader({ fullPage = false }) {
  const style = fullPage
    ? { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }
    : { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' };

  return (
    <div style={style}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
