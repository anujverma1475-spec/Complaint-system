import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminComplaintAPI, updateComplaintStatusAPI } from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import { useToast } from '../../components/Toast';

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [remark, setRemark] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await getAdminComplaintAPI(id);
      setComplaint(res.data);
      setNewStatus(res.data.status);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!newStatus) return;
    setUpdating(true);
    try {
      const res = await updateComplaintStatusAPI(id, { status: newStatus, remark });
      setComplaint(res.data);
      setRemark('');
      addToast(`Status updated to "${newStatus}"`, 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getTimelineDotClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'In Review': return 'in-review';
      case 'Resolved': return 'resolved';
      case 'Rejected': return 'rejected';
      default: return '';
    }
  };

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <h3 className="empty-state-title">{error}</h3>
            <Link to="/admin/complaints" className="btn btn-primary">Back to Complaints</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container fade-in">
        <div style={{ marginBottom: '16px' }}>
          <Link to="/admin/complaints" className="btn btn-ghost" style={{ padding: '8px 0' }}>
            ← Back to Complaints
          </Link>
        </div>

        <div className="detail-grid">
          {/* Main content */}
          <div>
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{complaint.title}</h1>
                <StatusBadge status={complaint.status} />
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span className="complaint-card-category">📂 {complaint.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  📅 {formatDate(complaint.createdAt)}
                </span>
              </div>

              <div className="detail-label">Description</div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '4px' }}>
                {complaint.description}
              </p>

              {complaint.imageUrl && (
                <div style={{ marginTop: '16px' }}>
                  <div className="detail-label">Attached Image</div>
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint attachment"
                    className="detail-image"
                    style={{ marginTop: '8px' }}
                  />
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>
                👤 Student Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div className="detail-label">Name</div>
                  <div className="detail-value">{complaint.student?.name}</div>
                </div>
                <div>
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{complaint.student?.email}</div>
                </div>
                <div>
                  <div className="detail-label">Roll No</div>
                  <div className="detail-value">{complaint.student?.rollNo}</div>
                </div>
                <div>
                  <div className="detail-label">Department</div>
                  <div className="detail-value">{complaint.student?.department}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Update Status */}
            <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--primary-glow)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>
                ⚡ Update Status
              </h3>

              <div className="form-group">
                <label className="form-label">New Status</label>
                <select
                  className="form-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Remark / Response</label>
                <textarea
                  className="form-input"
                  placeholder="Add a remark for the student..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                />
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={handleUpdate}
                disabled={updating || newStatus === complaint.status && !remark}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>

            {/* Timeline */}
            <div className="card">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>
                📋 Status Timeline
              </h3>

              <div className="timeline">
                {complaint.statusHistory?.map((entry, i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${getTimelineDotClass(entry.status)}`}></div>
                    <div className="timeline-content">
                      <div className="timeline-status">{entry.status}</div>
                      {entry.remark && (
                        <div className="timeline-remark">"{entry.remark}"</div>
                      )}
                      <div className="timeline-date">
                        {formatDate(entry.updatedAt)}
                        {entry.updatedBy?.name && ` • ${entry.updatedBy.name}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetail;
