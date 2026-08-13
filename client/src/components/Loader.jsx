const Loader = ({ fullPage = false }) => {
  return (
    <div className="loader-container" style={fullPage ? { minHeight: '100vh' } : {}}>
      <div className="spinner"></div>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="card" style={{ padding: '20px' }}>
    <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '12px' }}></div>
    <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '16px' }}></div>
    <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '8px' }}></div>
    <div className="skeleton" style={{ height: '14px', width: '80%' }}></div>
  </div>
);

export default Loader;
