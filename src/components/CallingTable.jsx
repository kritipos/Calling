

// src/components/CallingTable.jsx
import React from 'react';
import LeadRow from './LeadRow';

const CallingTable = ({ 
  leads, 
  startIndex, 
  onUpdateRemark, 
  onDelete,
  selectedRows,
  onSelectRow,
  onSelectAll
}) => {
  if (leads.length === 0) return null;

  return (
    <div className="table-responsive">
      <table className="table-modern">
        <thead>
          <tr>
            <th width="50">
              <div 
                className={`custom-checkbox ${selectedRows.length === leads.length && leads.length > 0 ? 'checked' : ''}`}
                onClick={onSelectAll}
              />
            </th>
            <th width="60">#</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Salary</th>
            <th>Location</th>
            <th>Allocation</th>
            <th>Remark</th>
            <th width="100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <LeadRow
              key={lead.row_id || index}
              lead={lead}
              serialNumber={startIndex + index + 1}
              onUpdateRemark={onUpdateRemark}
              onDelete={onDelete}
              isSelected={selectedRows.includes(lead.row_id)}
              onSelect={() => onSelectRow(lead.row_id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallingTable; 