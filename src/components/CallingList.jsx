import React, { useState, useEffect, useMemo } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useToast } from '../hooks/useToast';
import CallingTable from './CallingTable';
import Pagination from './Pagination';
import Toast from './Toast';
import { ROWS_PER_PAGE_OPTIONS } from '../utils/constants';
import '../styles/CallingList.css';

const CallingList = () => {
  const {
    leads,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedUser,
    setSelectedUser,
    users,
    updateRemark,
    deleteAndReplace,
    refreshLeads,
    totalLeads,
    userLeadCounts
  } = useLeads();

  const { toasts, showToast, removeToast } = useToast();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  // Filter leads based on selected user
  const filteredLeads = useMemo(() => {
    if (!selectedUser) return leads;
    return leads.filter(lead => lead.allocate_to === selectedUser);
  }, [leads, selectedUser]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUser, rowsPerPage]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredLeads.length);
  const pageLeads = filteredLeads.slice(startIndex, endIndex);

  // Handle remark update
  const handleUpdateRemark = async (rowId, remark) => {
    const result = await updateRemark(rowId, remark);
    if (result.success) {
      showToast('Remark saved successfully', 'success');
    } else {
      showToast(result.error || 'Failed to save remark', 'error');
    }
  };

  // Handle delete and replace
  const handleDelete = async (rowId) => {
    const result = await deleteAndReplace(rowId, selectedUser);
    if (result.success) {
      showToast(result.message || 'Lead replaced successfully', 'success');
      if (selectedRows.includes(rowId)) {
        setSelectedRows(selectedRows.filter(id => id !== rowId));
      }
    } else {
      showToast(result.error || 'Failed to replace lead', 'error');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Replace ${selectedRows.length} selected leads?`)) {
      let successCount = 0;
      for (const rowId of selectedRows) {
        const result = await deleteAndReplace(rowId, selectedUser);
        if (result.success) successCount++;
      }
      showToast(`Successfully replaced ${successCount} leads`, 'success');
      setSelectedRows([]);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refreshLeads();
    showToast('Leads refreshed successfully', 'success');
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === pageLeads.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(pageLeads.map(lead => lead.row_id));
    }
  };

  // Handle select row
  const handleSelectRow = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  if (error) {
    return (
      <div className="calling-list-wrapper">
        <div className="calling-list-container">
          <div className="empty-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button className="btn-refresh" onClick={handleRefresh}>
              <i className="fas fa-sync-alt"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calling-list-wrapper">
      <div className="calling-list-container">
        {/* Header Section */}
        <div className="list-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="header-title">
              <div className="title-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="title-content">
                <h2>Calling List</h2>
                <p>Manage and track your leads efficiently</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button 
                className="btn-refresh"
                onClick={handleRefresh}
                disabled={loading}
              >
                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, mobile, location..."
            />
          </div>

          <div className="filter-group">
          <select 
  className="filter-select"
  value={selectedUser}
  onChange={(e) => setSelectedUser(e.target.value)}
>
  <option value="all">All Users</option>  
  {users.map(user => (
    <option key={user} value={user}>
      {user} ({userLeadCounts[user] || 0})
    </option>
  ))}
</select>

            <select 
              className="rows-select"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {ROWS_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="bulk-actions">
            <div className="bulk-info">
              <i className="fas fa-check-circle"></i>
              <span>{selectedRows.length} lead{selectedRows.length > 1 ? 's' : ''} selected</span>
            </div>
            <button 
              className="btn-bulk-delete"
              onClick={handleBulkDelete}
            >
              <i className="fas fa-trash"></i>
              Replace Selected
            </button>
            <button 
              className="btn-clear"
              onClick={() => setSelectedRows([])}
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div className="loader-modern">
              <div className="spinner"></div>
              <p>Loading leads...</p>
            </div>
          ) : (
            <>
              <CallingTable
                leads={pageLeads}
                startIndex={startIndex}
                onUpdateRemark={handleUpdateRemark}
                onDelete={handleDelete}
                selectedRows={selectedRows}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
              />

              {filteredLeads.length === 0 && (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <h3>Choose your name to view leads</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalRecords={filteredLeads.length}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Toasts */}
      <div className="toast-container-modern">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default CallingList;