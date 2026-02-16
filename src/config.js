// src/config.js
const config = {
  // Google Apps Script URL
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycbzzL_djKmSBf3QCjQO-D6JzLJXIZWZ3Hx7fHC-aH20Ntu29UumWfV0WfJqyQwJDws0N9A/exec',
  
  // App settings
  MAX_LEADS_PER_USER: 40,
  DEFAULT_ROWS_PER_PAGE: 10,
  
  // User session (this would come from your auth system)
  // In a real app, this would be from context/redux
  currentUser: {
    id: 'USER_ID', // This should come from your auth system
    name: 'Current User',
    role: 'CR2'
  }
};

export default config;