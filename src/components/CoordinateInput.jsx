import React, { useState } from 'react';
import './CoordinateInput.css';

// Default coordinates for popular routes
const PRESET_ROUTES = [
  {
    name: 'Chennai to Mumbai',
    startLat: 13.0827,
    startLng: 80.2707,
    endLat: 19.0760,
    endLng: 72.8777
  },
  {
    name: 'Delhi to Kolkata',
    startLat: 28.7041,
    startLng: 77.1025,
    endLat: 22.5726,
    endLng: 88.3639
  },
  {
    name: 'Bangalore to Hyderabad',
    startLat: 12.9716,
    startLng: 77.5946,
    endLat: 17.3850,
    endLng: 78.4867
  }
];

const CoordinateInput = ({ onSubmit }) => {
  const [startLat, setStartLat] = useState('13.0827'); // Chennai
  const [startLng, setStartLng] = useState('80.2707');
  const [endLat, setEndLat] = useState('19.0760'); // Mumbai
  const [endLng, setEndLng] = useState('72.8777');
  const [selectedPreset, setSelectedPreset] = useState('Chennai to Mumbai');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate coordinates
    if (!startLat || !startLng || !endLat || !endLng) {
      setError('All coordinates are required');
      return;
    }

    // Convert to numbers and validate
    const coordinates = {
      startLat: parseFloat(startLat),
      startLng: parseFloat(startLng),
      endLat: parseFloat(endLat),
      endLng: parseFloat(endLng)
    };

    if (isNaN(coordinates.startLat) || isNaN(coordinates.startLng) || 
        isNaN(coordinates.endLat) || isNaN(coordinates.endLng)) {
      setError('All coordinates must be valid numbers');
      return;
    }

    // Validate latitude range (-90 to 90)
    if (coordinates.startLat < -90 || coordinates.startLat > 90 || 
        coordinates.endLat < -90 || coordinates.endLat > 90) {
      setError('Latitude must be between -90 and 90 degrees');
      return;
    }

    // Validate longitude range (-180 to 180)
    if (coordinates.startLng < -180 || coordinates.startLng > 180 || 
        coordinates.endLng < -180 || coordinates.endLng > 180) {
      setError('Longitude must be between -180 and 180 degrees');
      return;
    }

    // Clear any previous error
    setError('');
    
    // Submit the coordinates
    onSubmit(coordinates);
  };
  
  const handlePresetChange = (e) => {
    const preset = PRESET_ROUTES.find(route => route.name === e.target.value);
    if (preset) {
      setStartLat(preset.startLat.toString());
      setStartLng(preset.startLng.toString());
      setEndLat(preset.endLat.toString());
      setEndLng(preset.endLng.toString());
      setSelectedPreset(preset.name);
    }
  };
  
  const handleQuickSubmit = () => {
    // Submit with current values (useful for testing)
    onSubmit({
      startLat: parseFloat(startLat),
      startLng: parseFloat(startLng),
      endLat: parseFloat(endLat),
      endLng: parseFloat(endLng)
    });
  };

  return (
    <div className="coordinate-input">
      <h3>Route Planner</h3>
      
      <div className="preset-routes">
        <label htmlFor="preset-routes">Quick Select:</label>
        <select 
          id="preset-routes" 
          value={selectedPreset} 
          onChange={handlePresetChange}
        >
          {PRESET_ROUTES.map(route => (
            <option key={route.name} value={route.name}>
              {route.name}
            </option>
          ))}
        </select>
        <button 
          type="button" 
          className="quick-submit-btn" 
          onClick={handleQuickSubmit}
        >
          Go
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <h4>Starting Point</h4>
          <div className="coordinate-pair">
            <div className="input-field">
              <label htmlFor="start-lat">Latitude:</label>
              <input
                id="start-lat"
                type="text"
                value={startLat}
                onChange={(e) => setStartLat(e.target.value)}
                placeholder="Start Latitude"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="start-lng">Longitude:</label>
              <input
                id="start-lng"
                type="text"
                value={startLng}
                onChange={(e) => setStartLng(e.target.value)}
                placeholder="Start Longitude"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="input-group">
          <h4>Destination</h4>
          <div className="coordinate-pair">
            <div className="input-field">
              <label htmlFor="end-lat">Latitude:</label>
              <input
                id="end-lat"
                type="text"
                value={endLat}
                onChange={(e) => setEndLat(e.target.value)}
                placeholder="End Latitude"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="end-lng">Longitude:</label>
              <input
                id="end-lng"
                type="text"
                value={endLng}
                onChange={(e) => setEndLng(e.target.value)}
                placeholder="End Longitude"
                required
              />
            </div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn">Calculate Routes</button>
      </form>
    </div>
  );
};

export default CoordinateInput; 