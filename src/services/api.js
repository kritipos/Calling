// src/services/api.js
import axios from 'axios';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVUK3n1Qu_aodoSSMTFIMN5c7OiE2O6EUdXVvTSZZG1ykJkcBV9dodnd4lmqfpwARYdA/exec';

// Use a CORS proxy for development
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? CORS_PROXY + GOOGLE_SCRIPT_URL 
    : GOOGLE_SCRIPT_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  response => {
    console.log('Response received:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', error);
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - CORS issue likely');
    }
    return Promise.reject(error);
  }
);

export default api;