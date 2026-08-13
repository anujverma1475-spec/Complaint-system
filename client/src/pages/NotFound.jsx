import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '16px 0 8px' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
