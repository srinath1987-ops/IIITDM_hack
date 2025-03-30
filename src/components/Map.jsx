import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { getRoutes, getTrafficData, getRoadClosures } from '../services/api';
import { subscribeToTrafficUpdates, 
         subscribeToRouteUpdates, 
         subscribeToClosureUpdates,
         unsubscribeFromTrafficUpdates,
         unsubscribeFromRouteUpdates,
         unsubscribeFromClosureUpdates,
         connect } from '../services/socket';
import { polylineToLeaflet } from '../utils/polyline';
import MapLegend from './MapLegend';
import RouteInfo from './RouteInfo';
import CoordinateInput from './CoordinateInput';

// Fix Leaflet's icon paths for Vite
// This is needed because Vite handles assets differently
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon issue globally
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayersRef = useRef([]);
  const markersRef = useRef([]);
  const closureMarkersRef = useRef([]);
  const tollMarkersRef = useRef([]);
  
  const [coordinates, setCoordinates] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    console.log("Map container:", mapRef.current);
    
    if (!mapInstanceRef.current && mapRef.current) {
      try {
        // Make sure to set the height of the map container directly
        mapRef.current.style.height = '100%';
        mapRef.current.style.width = '100%';
        
        console.log("Creating map instance");
        
        // Center on India
        const map = L.map(mapRef.current, {
          center: [21.0, 78.0],
          zoom: 5,
          minZoom: 3,
          maxZoom: 18,
          zoomControl: true,
          attributionControl: true
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          crossOrigin: true
        }).addTo(map);
        
        mapInstanceRef.current = map;
        
        // Add a ping to verify map is working
        L.circleMarker([21.0, 78.0], {
          radius: 20,
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5
        }).addTo(map).bindPopup('Map initialized!').openPopup();
        
        // Set flag to indicate map is loaded
        setMapLoaded(true);
        
        // Fix map display by invalidating size after component has fully rendered
        setTimeout(() => {
          map.invalidateSize(true);
          console.log("Map size refreshed");
        }, 500);
        
        // Connect to WebSockets
        connect();
        setIsSocketConnected(true);
      } catch (error) {
        console.error("Error initializing map:", error);
        setError("Failed to initialize map: " + error.message);
      }
    }
    
    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Effect for handling route selection
  useEffect(() => {
    if (!mapInstanceRef.current || !routes.length) return;
    
    const map = mapInstanceRef.current;
    
    // Show the selected route more prominently
    routeLayersRef.current.forEach((layer, index) => {
      if (index === selectedRouteIndex) {
        layer.setStyle({ weight: 7, opacity: 0.8 });
        layer.bringToFront();
      } else {
        layer.setStyle({ weight: 4, opacity: 0.5 });
      }
    });
    
  }, [selectedRouteIndex, routes]);

  // Fetch routes and set up real-time updates when coordinates change
  useEffect(() => {
    if (!coordinates || !mapInstanceRef.current || !mapLoaded) return;
    
    const fetchRoutesData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Clear previous routes and markers
        clearMap();
        
        // Add start and end markers
        addMarkers(coordinates);
        
        // Fetch routes from API
        const routesData = await getRoutes(
          coordinates.startLat,
          coordinates.startLng,
          coordinates.endLat,
          coordinates.endLng
        );
        
        if (routesData.success && routesData.routes) {
          setRoutes(routesData.routes);
          
          // Draw routes on map
          drawRoutes(routesData.routes);
          
          // Draw closures if available
          if (routesData.closures && routesData.closures.length > 0) {
            drawClosures(routesData.closures);
          }
          
          // Set up real-time updates
          setupRealTimeUpdates(coordinates);
        } else {
          setError('Failed to fetch routes');
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
        setError('Error fetching routes: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoutesData();
    
    // Cleanup function to remove subscriptions when coordinates change
    return () => {
      if (isSocketConnected) {
        unsubscribeFromTrafficUpdates(handleTrafficUpdate);
        unsubscribeFromRouteUpdates(handleRouteUpdate);
        unsubscribeFromClosureUpdates(handleClosureUpdate);
      }
    };
  }, [coordinates, isSocketConnected, mapLoaded]);

  // Add window resize handler to fix map display issues
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        console.log("Window resized, refreshing map");
        mapInstanceRef.current.invalidateSize(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Invalidate map size shortly after component mounts
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize(true);
        console.log("Map size refreshed after timeout");
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const clearMap = () => {
    // Clear previous routes
    routeLayersRef.current.forEach(layer => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
    routeLayersRef.current = [];
    
    // Clear markers
    markersRef.current.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
    
    // Clear closure markers
    closureMarkersRef.current.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    closureMarkersRef.current = [];
    
    // Clear toll markers
    tollMarkersRef.current.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    tollMarkersRef.current = [];
  };

  const addMarkers = (coords) => {
    if (!mapInstanceRef.current) return;
    
    // Add start marker
    const startMarker = L.marker([coords.startLat, coords.startLng])
      .addTo(mapInstanceRef.current)
      .bindPopup('Start: Chennai')
      .openPopup();
    
    // Add end marker
    const endMarker = L.marker([coords.endLat, coords.endLng])
      .addTo(mapInstanceRef.current)
      .bindPopup('End: Mumbai');
    
    markersRef.current.push(startMarker, endMarker);
    
    // Fit map to markers
    const bounds = L.latLngBounds([
      [coords.startLat, coords.startLng],
      [coords.endLat, coords.endLng]
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  const drawRoutes = (routesData) => {
    if (!mapInstanceRef.current) return;
    
    const colors = ['#3388ff', '#ff8833', '#33ff88']; // Colors for different routes
    
    routesData.forEach((route, index) => {
      try {
        if (!route.geometry) {
          console.error('Missing geometry for route:', route);
          return;
        }
        
        // Decode the polyline
        const latlngs = polylineToLeaflet(route.geometry);
        
        if (!latlngs || latlngs.length === 0) {
          console.error('Empty polyline for route:', route);
          return;
        }
        
        // Create polyline with appropriate color
        const polyline = L.polyline(latlngs, {
          color: colors[index % colors.length],
          weight: index === 0 ? 7 : 4,
          opacity: index === 0 ? 0.8 : 0.5
        }).addTo(mapInstanceRef.current);
        
        routeLayersRef.current.push(polyline);
        
        // Add toll markers for the route
        if (route.tollPoints && route.tollPoints.length > 0) {
          route.tollPoints.forEach(toll => {
            const tollMarker = L.marker([toll.lat, toll.lng], {
              icon: L.divIcon({
                html: '💰',
                className: 'toll-icon',
                iconSize: [24, 24]
              })
            }).addTo(mapInstanceRef.current)
              .bindPopup(`Toll: ${toll.cost || 'N/A'} ${toll.currency || 'INR'}`);
            
            tollMarkersRef.current.push(tollMarker);
          });
        }
      } catch (error) {
        console.error('Error drawing route:', error);
      }
    });
  };

  const drawClosures = (closures) => {
    if (!mapInstanceRef.current) return;
    
    closures.forEach(closure => {
      const closureMarker = L.marker([closure.lat, closure.lng], {
        icon: L.divIcon({
          html: '🚧',
          className: 'closure-icon',
          iconSize: [24, 24]
        })
      }).addTo(mapInstanceRef.current)
        .bindPopup(`Closure: ${closure.reason}`);
      
      closureMarkersRef.current.push(closureMarker);
    });
  };

  const setupRealTimeUpdates = (coords) => {
    if (!isSocketConnected) return;
    
    // Subscribe to traffic updates
    const centerLat = (coords.startLat + coords.endLat) / 2;
    const centerLng = (coords.startLng + coords.endLng) / 2;
    
    subscribeToTrafficUpdates(centerLat, centerLng, 50000, handleTrafficUpdate);
    
    // Subscribe to route updates
    subscribeToRouteUpdates(
      coords.startLat,
      coords.startLng,
      coords.endLat,
      coords.endLng,
      handleRouteUpdate
    );
    
    // Subscribe to closure updates
    subscribeToClosureUpdates(centerLat, centerLng, handleClosureUpdate);
  };

  const handleTrafficUpdate = (trafficData) => {
    console.log('Received traffic update:', trafficData);
    // In a real app, you would update the traffic visualization on the map
  };

  const handleRouteUpdate = (routeData) => {
    console.log('Received route update:', routeData);
    // In a real app, you would update the routes based on new data
  };

  const handleClosureUpdate = (closureData) => {
    console.log('Received closure update:', closureData);
    
    // Add a new closure marker
    if (mapInstanceRef.current && closureData.lat && closureData.lng) {
      const closureMarker = L.marker([closureData.lat, closureData.lng], {
        icon: L.divIcon({
          html: '🚧',
          className: 'closure-icon',
          iconSize: [24, 24]
        })
      }).addTo(mapInstanceRef.current)
        .bindPopup(`New Closure: ${closureData.reason}`);
      
      closureMarkersRef.current.push(closureMarker);
    }
  };

  const handleCoordinateSubmit = (coords) => {
    setCoordinates(coords);
  };

  const handleRouteSelect = (index) => {
    setSelectedRouteIndex(index);
  };

  return (
    <div className="map-container">
      <div className="map-sidebar">
        <CoordinateInput onSubmit={handleCoordinateSubmit} />
        
        {loading && <div className="loading">Loading routes...</div>}
        {error && <div className="error">{error}</div>}
        
        {routes.length > 0 && (
          <RouteInfo 
            routes={routes} 
            selectedRouteIndex={selectedRouteIndex} 
            onSelectRoute={handleRouteSelect} 
          />
        )}
        
        <MapLegend />
      </div>
      
      <div ref={mapRef} className="map-display">
        {!mapLoaded && <div style={{padding: '20px', color: 'red'}}>Loading map...</div>}
      </div>
    </div>
  );
};

export default Map;