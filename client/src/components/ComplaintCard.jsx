import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint, linkTo }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Link to={linkTo} className="complaint-card fade-in">
      <div className="complaint-card-header">
        <h3 className="complaint-card-title">{complaint.title}</h3>
        <StatusBadge status={complaint.status} />
      </div>
      <div className="complaint-card-meta">
        <span className="complaint-card-category">📂 {complaint.category}</span>
        <span>📅 {formatDate(complaint.createdAt)}</span>
        {complaint.student?.name && (
          <span className="hide-mobile">👤 {complaint.student.name}</span>
        )}
      </div>
      <p className="complaint-card-desc">{complaint.description}</p>
    </Link>
  );
};

export default ComplaintCard;
