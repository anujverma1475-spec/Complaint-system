import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaintAPI } from '../../api/axios';
import { useToast } from '../../components/Toast';

const NewComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const categories = ['Hostel', 'Academic', 'Infrastructure', 'Ragging', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      if (image) data.append('image', image);

      await createComplaintAPI(data);
      addToast('Complaint submitted successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to submit';
      setError(msg);
      addToast('Failed to submit complaint', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container fade-in" style={{ maxWidth: '640px' }}>
        <div className="page-header">
          <h1 className="page-title">New Complaint</h1>
          <p className="page-subtitle">Describe your issue and we'll look into it</p>
        </div>

        <div className="card">
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger-light)',
              fontSize: '0.875rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Brief title of your complaint"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Provide detailed information about your complaint..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attach Image (optional)</label>
              {!imagePreview ? (
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="file-upload-icon">📷</div>
                  <div className="file-upload-text">
                    Click or drag to upload an image<br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      JPG, PNG, GIF, WebP — Max 5MB
                    </span>
                  </div>
                </div>
              ) : (
                <div className="file-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="file-preview-remove"
                    onClick={removeImage}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewComplaint;
