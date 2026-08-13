import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="landing-hero">
      <div className="landing-content slide-up">
        <div className="landing-badge">
          ✨ College Complaint Management System
        </div>
        <h1 className="landing-title">
          Your Voice<br />Matters Here
        </h1>
        <p className="landing-desc">
          Submit complaints, track their progress in real-time, and get
          resolutions faster. A transparent system built for students, managed by admins.
        </p>
        <div className="landing-actions">
          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin/dashboard' : '/dashboard'}
              className="btn btn-primary btn-lg"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started →
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginTop: '48px',
          textAlign: 'left'
        }}>
          {[
            { icon: '📝', title: 'Easy Submission', desc: 'Submit complaints with images in seconds' },
            { icon: '📊', title: 'Live Tracking', desc: 'Real-time status updates on your complaints' },
            { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected and confidential' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
