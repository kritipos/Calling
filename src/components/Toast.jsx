// src/components/Toast.jsx
import React from 'react';

const Toast = ({ toast, onClose }) => {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  const bgColors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };

  return (
    <div 
      className="toast show align-items-center text-white border-0"
      style={{ backgroundColor: bgColors[toast.type] }}
      role="alert"
    >
      <div className="d-flex">
        <div className="toast-body">
          <i className={`fas ${icons[toast.type]} me-2`}></i>
          {toast.message}
        </div>
        <button 
          type="button" 
          className="btn-close btn-close-white me-2 m-auto" 
          onClick={() => onClose(toast.id)}
          aria-label="Close"
        />
      </div>
    </div>
  );
};

export default Toast;