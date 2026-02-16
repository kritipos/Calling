import React, { useState } from 'react';

const LeadRow = ({ 
  lead, 
  serialNumber, 
  onUpdateRemark, 
  onDelete,
  isSelected,
  onSelect 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [remark, setRemark] = useState(lead.remark || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateRemark(lead.row_id, remark);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCallClick = (e) => {
    e.stopPropagation(); // Prevent row selection or any other events
    const phoneNumber = lead.mobile;
    if (phoneNumber) {
      const formattedNumber = String(phoneNumber).replace(/\D/g, '');
      window.location.href = `tel:${formattedNumber}`;
    }
  };

  const getBadgeColor = (value) => {
    if (!value) return '';
    // You can customize this based on your data
    return 'badge-info';
  };

  return (
    <tr>
      <td>
        <div 
          className={`custom-checkbox ${isSelected ? 'checked' : ''}`}
          onClick={onSelect}
        />
      </td>
      <td>
        <span className="serial-number">{serialNumber}</span>
      </td>
      <td>
        <div>
          <strong>{lead.name || 'N/A'}</strong>
          {lead.pan && (
            <div>
              <small className="text-muted">PAN: {lead.pan}</small>
            </div>
          )}
        </div>
      </td>
      <td>
        <div>
          <div 
            onClick={handleCallClick}
            style={{ cursor: 'pointer' }}
            title={lead.mobile ? `Call ${lead.mobile}` : 'No phone number'}
          >
            <i className="fas fa-phone-alt text-muted me-1"></i> 
            {lead.mobile || 'N/A'}
          </div>
        </div>
      </td>
      <td>
        {lead.salary ? (
          <span className={`badge ${getBadgeColor(lead.salary)}`}>
            <i className="fas fa-rupee-sign me-1"></i>
            {lead.salary}
          </span>
        ) : (
          <span className="text-muted">N/A</span>
        )}
      </td>
      <td>
        {lead.location ? (
          <span>
            <i className="fas fa-map-marker-alt text-muted me-1"></i>
            {lead.location}
          </span>
        ) : (
          <span className="text-muted">N/A</span>
        )}
      </td>
      <td>
        {lead.allocate_to ? (
          <span className={`badge badge-success`}>
            <i className="fas fa-user me-1"></i>
            {lead.allocate_to}
          </span>
        ) : (
          <span className="badge badge-warning">
            <i className="fas fa-user-slash me-1"></i>
            Unallocated
          </span>
        )}
      </td>
      <td className="remark-cell">
        {isEditing ? (
          <div className="d-flex gap-2">
            <input
              type="text"
              className="remark-input"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              autoFocus
              placeholder="Add remark..."
            />
            <button 
              className="btn-icon save"
              onClick={handleSave}
              disabled={isSaving}
            >
              <i className={`fas fa-${isSaving ? 'spinner fa-spin' : 'check'}`}></i>
            </button>
          </div>
        ) : (
          <div 
            className="remark-display"
            onClick={() => setIsEditing(true)}
          >
            {lead.remark || <span className="text-muted">Click to add remark</span>}
          </div>
        )}
      </td>
      <td>
        <div className="action-buttons">
          {/* WhatsApp Button */}
          {lead.mobile && (
            <a 
              href={`https://wa.me/${String(lead.mobile).replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon whatsapp"
              title="Chat on WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          )}
          {!isEditing && (
            <button 
              className="btn-icon edit"
              onClick={() => setIsEditing(true)}
              title="Edit Remark"
            >
              <i className="fas fa-pen"></i>
            </button>
          )}
          
          <button 
            className="btn-icon delete"
            onClick={() => onDelete(lead.row_id)}
            title="Delete Lead"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LeadRow;