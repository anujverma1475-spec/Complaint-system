import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="container fade-in">
        <div className="page-header">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Your account information</p>
        </div>

        <div className="card profile-card">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 600 }}>
            {user?.name}
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {user?.role === 'admin' ? '🛡️ Administrator' : '🎓 Student'}
          </p>

          <div className="profile-info">
            <div className="profile-row">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Email</span>
              <span style={{ fontSize: '0.875rem' }}>{user?.email}</span>
            </div>
            {user?.rollNo && (
              <div className="profile-row">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Roll Number</span>
                <span style={{ fontSize: '0.875rem' }}>{user?.rollNo}</span>
              </div>
            )}
            {user?.department && (
              <div className="profile-row">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Department</span>
                <span style={{ fontSize: '0.875rem' }}>{user?.department}</span>
              </div>
            )}
            <div className="profile-row">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Role</span>
              <span className={`badge ${user?.role === 'admin' ? 'badge-resolved' : 'badge-in-review'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <button
            className="btn btn-danger btn-block"
            onClick={handleLogout}
            style={{ marginTop: '24px' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
