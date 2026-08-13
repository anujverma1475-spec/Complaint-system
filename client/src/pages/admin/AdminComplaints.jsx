import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminComplaintsAPI } from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import ComplaintCard from '../../components/ComplaintCard';
import { SkeletonCard } from '../../components/Loader';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter, search]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (search) params.search = search;
      const res = await getAdminComplaintsAPI(params);
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['Pending', 'In Review', 'Resolved', 'Rejected'];
  const categories = ['Hostel', 'Academic', 'Infrastructure', 'Ragging', 'Other'];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="page">
      <div className="container fade-in">
        <div className="page-header">
          <h1 className="page-title">All Complaints 📋</h1>
          <p className="page-subtitle">{complaints.length} complaints total</p>
        </div>

        {/* Search */}
        <div className="search-bar">
          <span className="search-bar-icon">🔍</span>
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <button
              className={`filter-btn ${!statusFilter ? 'active' : ''}`}
              onClick={() => setStatusFilter('')}
            >
              All Status
            </button>
            {statuses.map((s) => (
              <button
                key={s}
                className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <button
              className={`filter-btn ${!categoryFilter ? 'active' : ''}`}
              onClick={() => setCategoryFilter('')}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-btn ${categoryFilter === c ? 'active' : ''}`}
                onClick={() => setCategoryFilter(categoryFilter === c ? '' : c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="table-wrapper">
          {loading ? (
            <div className="complaints-list">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No complaints found</h3>
              <p className="empty-state-desc">Try adjusting your filters</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} onClick={() => window.location.href = `/admin/complaints/${c._id}`}>
                    <td style={{ fontWeight: 500 }}>{c.title}</td>
                    <td>
                      <div>{c.student?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{c.student?.rollNo}</div>
                    </td>
                    <td><span className="complaint-card-category">{c.category}</span></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="mobile-cards">
          {loading ? (
            <div className="complaints-list">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No complaints found</h3>
            </div>
          ) : (
            <div className="complaints-list">
              {complaints.map((c) => (
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
    </div>
  );
};

export default AdminComplaints;
