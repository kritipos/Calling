// src/components/UserFilter.jsx
import React from 'react';

const UserFilter = ({ 
  users, 
  value, 
  onChange, 
  userCounts = {}, 
  className = '' 
}) => {
  return (
    <select 
      className={`form-select ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>Select a user...</option>
      {users.map(user => (
        <option key={user} value={user}>
          {user} ({userCounts[user] || 0})
        </option>
      ))}
    </select>
  );
};

export default UserFilter;