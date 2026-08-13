import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/login');
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  // Public nav
  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">🎓 ComplaintDesk</Link>
          <ul className="navbar-links">
            <li><NavLink to="/login" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Login</NavLink></li>
            <li><NavLink to="/register" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Register</NavLink></li>
          </ul>
          {/* Mobile */}
          <div className="hide-desktop" style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login" className="btn btn-sm btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
          </div>
        </div>
      </nav>
    );
  }

  // Admin nav
  if (isAdmin) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-content">
            <Link to="/admin/dashboard" className="navbar-brand">🎓 ComplaintDesk</Link>
            <ul className="navbar-links">
              <li><NavLink to="/admin/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink></li>
              <li><NavLink to="/admin/complaints" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Complaints</NavLink></li>
              <li><NavLink to="/profile" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Profile</NavLink></li>
              <li><button className="btn btn-sm btn-ghost" onClick={handleLogout}>Logout</button></li>
            </ul>
            <button className="hamburger" onClick={toggleDrawer} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>

        {/* Admin mobile drawer */}
        <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
          <NavLink to="/admin/dashboard" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeDrawer}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/complaints" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeDrawer}>
            📋 All Complaints
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeDrawer}>
            👤 Profile
          </NavLink>
          <button className="drawer-link" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}>
            🚪 Logout
          </button>
        </div>
      </>
    );
  }

  // Student nav — top bar + bottom tab bar on mobile
  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">🎓 ComplaintDesk</Link>
          <ul className="navbar-links">
            <li><NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink></li>
            <li><NavLink to="/complaints/new" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>New Complaint</NavLink></li>
            <li><NavLink to="/profile" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Profile</NavLink></li>
            <li><button className="btn btn-sm btn-ghost" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </nav>

      {/* Student bottom tab bar (mobile only) */}
      <div className="bottom-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </NavLink>
        <NavLink to="/complaints/new" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          New
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Profile
        </NavLink>
      </div>
    </>
  );
};

export default Navbar;
