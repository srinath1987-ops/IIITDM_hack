import React from 'react';
import './MapLegend.css';

const MapLegend = () => {
  return (
    <div className="map-legend">
      <h3>Map Legend</h3>
      
      <div className="legend-section">
        <h4>Routes</h4>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3388ff' }}></div>
          <span>Primary Route</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff8833' }}></div>
          <span>Alternative Route 1</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#33ff88' }}></div>
          <span>Alternative Route 2</span>
        </div>
      </div>
      
      <div className="legend-section">
        <h4>Points of Interest</h4>
        <div className="legend-item">
          <div className="legend-icon">📍</div>
          <span>Start/End Point</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon">🚧</div>
          <span>Road Closure</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon">💰</div>
          <span>Toll Plaza</span>
        </div>
      </div>
      
      <div className="legend-section">
        <h4>Traffic Conditions</h4>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4caf50' }}></div>
          <span>Low Traffic</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff9800' }}></div>
          <span>Moderate Traffic</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f44336' }}></div>
          <span>Heavy Traffic</span>
        </div>
      </div>
      
      <div className="legend-note">
        <p>Click on any route or marker for more information</p>
      </div>
    </div>
  );
};

export default MapLegend; 