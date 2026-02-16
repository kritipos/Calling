// src/utils/formatters.js
export const formatCurrency = (amount) => {
  if (!amount) return '-';
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '-';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  
  try {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return '-';
  }
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  
  // Convert to string if it's a number
  const phoneStr = String(phone).trim();
  
  if (phoneStr === '' || phoneStr === 'null' || phoneStr === 'undefined') {
    return '-';
  }
  
  // Remove any non-numeric characters
  const cleaned = phoneStr.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{1})(\d{5})(\d{5})/, '$1 $2 $3');
  } else if (cleaned.length === 12) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{5})/, '$1 $2 $3');
  }
  
  // Return original if can't format
  return phoneStr;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '-';
  
  const textStr = String(text);
  
  if (textStr.length <= maxLength) return textStr;
  return textStr.substring(0, maxLength) + '...';
};

// Safe string getter
export const safeString = (value, defaultValue = '-') => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  return String(value);
};

// Safe number formatter
export const safeNumber = (value, defaultValue = '-') => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};