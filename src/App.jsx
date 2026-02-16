// src/App.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CallingList from './components/CallingList';
import './styles/App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <div className="App">
      <CallingList />
    </div>
  );
}

export default App;