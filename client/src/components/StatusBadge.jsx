const StatusBadge = ({ status }) => {
  const getClass = () => {
    switch (status) {
      case 'Pending': return 'badge-pending';
      case 'In Review': return 'badge-in-review';
      case 'Resolved': return 'badge-resolved';
      case 'Rejected': return 'badge-rejected';
      default: return 'badge-pending';
    }
  };

  const getDot = () => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'In Review': return '🔍';
      case 'Resolved': return '✅';
      case 'Rejected': return '❌';
      default: return '⏳';
    }
  };

  return (
    <span className={`badge ${getClass()}`}>
      {getDot()} {status}
    </span>
  );
};

export default StatusBadge;
