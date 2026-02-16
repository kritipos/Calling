// src/components/Loader.jsx
import React from 'react';

const Loader = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{message}</span>
        </div>
        {message && <div className="mt-2 text-muted">{message}</div>}
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      {message && <div className="mt-2 text-muted small">{message}</div>}
    </div>
  );
};

export default Loader;