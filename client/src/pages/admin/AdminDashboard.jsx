import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStatsAPI, getAdminComplaintsAPI } from '../../api/axios';
import ComplaintCard from '../../components/ComplaintCard';
import { SkeletonCard } from '../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        getAdminStatsAPI(),
        getAdminComplaintsAPI(),
      ]);
      setStats(statsRes.data);
      setRecentComplaints(complaintsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container fade-in">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard 📊</h1>
          <p className="page-subtitle">Overview of all complaints</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--primary-light)' }}>
              {stats?.total || 0}
            </div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--warning)' }}>
              {stats?.byStatus?.Pending || 0}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--info)' }}>
              {stats?.byStatus?.['In Review'] || 0}
            </div>
            <div className="stat-label">In Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--success)' }}>
              {stats?.byStatus?.Resolved || 0}
            </div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        {/* Category breakdown */}
        {stats?.byCategory && Object.keys(stats.byCategory).length > 0 && (
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>
              📂 By Category
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {Object.entries(stats.byCategory).map(([cat, count]) => (
                <div key={cat} style={{
                  padding: '8px 16px',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>{cat}</span>
                  <span style={{
                    background: 'var(--primary-glow)',
                    color: 'var(--primary-light)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Complaints */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Complaints</h2>
          <Link to="/admin/complaints" className="btn btn-ghost btn-sm">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="complaints-list">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">No complaints yet</h3>
            <p className="empty-state-desc">Complaints will appear here once students submit them</p>
          </div>
        ) : (
          <div className="complaints-list">
            {recentComplaints.map((c) => (
              <ComplaintCard
                key={c._id}
                complaint={c}
                linkTo={`/admin/complaints/${c._id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
