import { useState, useEffect } from 'react';
import Map from './components/Map';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Logistics Route Optimization System</h1>
      </header>
      
      <main className="app-content">
        <Map />
      </main>
    </div>
  );
}

export default App;