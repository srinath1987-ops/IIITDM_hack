import React from 'react';
import './RouteInfo.css';

const RouteInfo = ({ routes, selectedRouteIndex, onSelectRoute }) => {
  if (!routes || routes.length === 0) {
    return null;
  }

  const selectedRoute = routes[selectedRouteIndex];
  
  // Format distance in kilometers
  const formatDistance = (distanceKm) => {
    return `${distanceKm.toFixed(1)} km`;
  };
  
  // Format duration in hours and minutes
  const formatDuration = (durationSeconds) => {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${minutes} min`;
    }
  };
  
  // Format traffic delay nicely
  const formatDelay = (delaySeconds) => {
    if (!delaySeconds) return 'No delay';
    
    const minutes = Math.floor(delaySeconds / 60);
    
    if (minutes < 60) {
      return `${minutes} min delay`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (remainingMinutes === 0) {
        return `${hours} hr delay`;
      } else {
        return `${hours} hr ${remainingMinutes} min delay`;
      }
    }
  };

  return (
    <div className="route-info">
      <h3>Route Options</h3>
      
      <div className="route-tabs">
        {routes.map((route, index) => (
          <button
            key={`route-tab-${index}`}
            className={`route-tab ${index === selectedRouteIndex ? 'active' : ''}`}
            onClick={() => onSelectRoute(index)}
          >
            {index === 0 ? 'Fastest' : index === 1 ? 'Alternate 1' : `Alternate ${index}`}
          </button>
        ))}
      </div>
      
      <div className="route-details">
        <div className="route-header">
          <h4>
            {selectedRoute.segments && selectedRoute.segments.length > 0 ? (
              <>
                {selectedRoute.segments[0].start} to {selectedRoute.segments[selectedRoute.segments.length - 1].end}
              </>
            ) : (
              'Selected Route'
            )}
          </h4>
        </div>
        
        <div className="route-stats">
          <div className="stat-item">
            <div className="stat-label">Distance</div>
            <div className="stat-value">{formatDistance(selectedRoute.distance)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Duration</div>
            <div className="stat-value">{formatDuration(selectedRoute.duration)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Traffic</div>
            <div className="stat-value">{formatDelay(selectedRoute.trafficDelay)}</div>
          </div>
        </div>
        
        {selectedRoute.tollCost && (
          <div className="route-tolls">
            <div className="toll-header">Toll Information</div>
            <div className="toll-details">
              <div className="toll-cost">₹{selectedRoute.tollCost.toFixed(2)}</div>
              <div className="toll-count">
                {selectedRoute.tollPoints ? `${selectedRoute.tollPoints.length} toll plazas` : 'Multiple toll plazas'}
              </div>
            </div>
          </div>
        )}
        
        {selectedRoute.restrictions && selectedRoute.restrictions.length > 0 && (
          <div className="route-restrictions">
            <div className="restrictions-header">Restrictions</div>
            <ul className="restrictions-list">
              {selectedRoute.restrictions.map((restriction, index) => (
                <li key={`restriction-${index}`}>{restriction}</li>
              ))}
            </ul>
          </div>
        )}
        
        {selectedRoute.segments && selectedRoute.segments.length > 0 && (
          <div className="route-segments">
            <div className="segments-header">Route Segments</div>
            <div className="segments-list">
              {selectedRoute.segments.map((segment, index) => (
                <div key={`segment-${index}`} className="segment-item">
                  <div className="segment-name">
                    {segment.start} → {segment.end}
                  </div>
                  <div className="segment-info">
                    {formatDistance(segment.distance)} | {formatDuration(segment.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteInfo; 