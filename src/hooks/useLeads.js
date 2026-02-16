// src/hooks/useLeads.js
import { useState, useEffect, useCallback } from 'react';
import googleSheetsService from '../services/googleSheetsService';
import config from '../config';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLeadCounts, setUserLeadCounts] = useState({});
  const [initializationMessage, setInitializationMessage] = useState('');

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await googleSheetsService.getAllocatedLeads();
      
      // Ensure data is an array
      const leadsArray = Array.isArray(data) ? data : [];
      console.log('Fetched leads:', leadsArray.length); // Debug log
      setLeads(leadsArray);
      
      // Extract unique users from leads (for filter)
      const uniqueUsers = [...new Set(
        leadsArray
          .map(lead => lead.allocate_to)
          .filter(user => user && typeof user === 'string' && user.trim() !== '')
      )];
      setUsers(uniqueUsers);
      
      // Calculate user lead counts
      const counts = {};
      leadsArray.forEach(lead => {
        if (lead.allocate_to) {
          counts[lead.allocate_to] = (counts[lead.allocate_to] || 0) + 1;
        }
      });
      setUserLeadCounts(counts);
      
      setError(null);
    } catch (err) {
      console.error('Fetch leads error:', err);
      setError(err.message || 'Failed to fetch leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize leads on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        // Check if initializeLeads exists
        if (typeof googleSheetsService.initializeLeads === 'function') {
          const initResult = await googleSheetsService.initializeLeads();
          console.log('Initialization result:', initResult);
          setInitializationMessage(initResult.message || '');
        } else {
          console.warn('initializeLeads method not found, skipping...');
        }
        
        await fetchLeads();
      } catch (err) {
        console.error('Initialize error:', err);
        setError(err.message || 'Failed to initialize');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [fetchLeads]);

  // Filter leads based on search and user filter
  useEffect(() => {
    let filtered = [...leads];

    // Apply search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(lead => {
        const name = String(lead.name || '').toLowerCase();
        const mobile = String(lead.mobile || '');
        const location = String(lead.location || '').toLowerCase();
        const pan = String(lead.pan || '').toLowerCase();
        const remark = String(lead.remark || '').toLowerCase();
        
        return name.includes(term) || 
               mobile.includes(term) || 
               location.includes(term) ||
               pan.includes(term) ||
               remark.includes(term);
      });
    }

    // Apply user filter
    if (selectedUser && selectedUser !== 'all') {
      filtered = filtered.filter(lead => 
        String(lead.allocate_to || '') === selectedUser
      );
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, selectedUser]);

  // Update remark
  const updateRemark = async (rowId, remark) => {
    try {
      const result = await googleSheetsService.updateRemark(rowId, remark);
      
      if (result.success) {
        // Update local state
        setLeads(prev => prev.map(lead => 
          String(lead.row_id) === String(rowId)
            ? { ...lead, remark: remark }
            : lead
        ));
        
        return { success: true, message: 'Remark updated successfully' };
      }
      
      return result;
    } catch (err) {
      console.error('Update remark error:', err);
      return {
        success: false,
        error: err.message || 'Failed to update remark'
      };
    }
  };

  // Delete and replace lead
  const deleteAndReplace = async (rowId) => {
    try {
      const result = await googleSheetsService.deleteAndReplaceLead(rowId);
      
      if (result.success) {
        // Refresh leads to get updated data
        await fetchLeads();
        
        return {
          success: true,
          message: result.message || 'Lead replaced successfully'
        };
      }
      
      return result;
    } catch (err) {
      console.error('Delete and replace error:', err);
      return {
        success: false,
        error: err.message || 'Failed to delete and replace'
      };
    }
  };

  // Refresh leads
  const refreshLeads = async () => {
    setRefreshing(true);
    await fetchLeads();
    setRefreshing(false);
  };

  return {
    leads: filteredLeads,
    allLeads: leads,
    loading,
    refreshing,
    error,
    searchTerm,
    setSearchTerm,
    selectedUser,
    setSelectedUser,
    users,
    userLeadCounts,
    updateRemark,
    deleteAndReplace,
    refreshLeads,
    totalLeads: leads.length,
    initializationMessage,
    currentUser: config.currentUser.name,
    maxLeadsPerUser: config.MAX_LEADS_PER_USER
  };
};