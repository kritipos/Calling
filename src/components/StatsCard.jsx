// src/components/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stats-card">
      <div className={`stats-icon bg-${color} bg-opacity-10`}>
        <i className={`fas ${icon} text-${color}`}></i>
      </div>
      <div className="stats-info">
        <span className="stats-label">{title}</span>
        <span className="stats-value">{value.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default StatsCard;