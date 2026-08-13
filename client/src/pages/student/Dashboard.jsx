import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyComplaintsAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ComplaintCard from '../../components/ComplaintCard';
import { SkeletonCard } from '../../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getMyComplaintsAPI();
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['All', 'Pending', 'In Review', 'Resolved', 'Rejected'];
  const filtered = filter === 'All'
    ? complaints
    : complaints.filter((c) => c.status === filter);

  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    inReview: complaints.filter((c) => c.status === 'In Review').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="page">
      <div className="container fade-in">
        <div className="page-header">
          <h1 className="page-title">Welcome, {user?.name} 👋</h1>
          <p className="page-subtitle">Track and manage your complaints</p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--primary-light)' }}>{counts.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--warning)' }}>{counts.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--info)' }}>{counts.inReview}</div>
            <div className="stat-label">In Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--success)' }}>{counts.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        {/* New complaint button (desktop) */}
        <div className="hide-mobile" style={{ marginBottom: '16px' }}>
          <Link to="/complaints/new" className="btn btn-primary">
            + New Complaint
          </Link>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          {statuses.map((s) => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s} {s !== 'All' ? `(${complaints.filter((c) => s === 'All' || c.status === s).length})` : ''}
            </button>
          ))}
        </div>

        {/* Complaints list */}
        {loading ? (
          <div className="complaints-list">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">
              {filter === 'All' ? 'No complaints yet' : `No ${filter.toLowerCase()} complaints`}
            </h3>
            <p className="empty-state-desc">
              {filter === 'All'
                ? 'Submit your first complaint to get started'
                : 'Try a different filter'}
            </p>
            {filter === 'All' && (
              <Link to="/complaints/new" className="btn btn-primary">
                Submit a Complaint
              </Link>
            )}
          </div>
        ) : (
          <div className="complaints-list">
            {filtered.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                linkTo={`/complaints/${complaint._id}`}
              />
            ))}
          </div>
        )}

        {/* Mobile FAB */}
        <Link to="/complaints/new" className="fab" aria-label="New Complaint">
          +
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
