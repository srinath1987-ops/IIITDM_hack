
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for your data structures
interface Toll {
  name: string;
  cost: number;
}

interface Route {
  id: number;
  name: string;
  isRecommended: boolean;
  distance: number;
  duration: number;
  tollCost: number;
  fuelCost: number;
  tolls: Toll[];
  timeSaved: number;
  weather: string;
}

interface MapProps {
  start: string;
  destination: string;
  selectedRoute: Route;
  vehicleType?: string;
  goodsType?: string;
  weight?: string;
}

// Using a placeholder token - in a production app, this would be an environment variable
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYmxpdHpqYiIsImEiOiJjbTEweDAzb20wOGhiMnRwZGNqZ2NsdXF6In0.DhETe3EckUcqEAvDDQsfLA';

const Map = ({ start, destination, selectedRoute, vehicleType, goodsType, weight }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_ACCESS_TOKEN);
  const [error, setError] = useState<string | null>(null);

  // Function to convert address to coordinates
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&country=in&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].center;
      } else {
        throw new Error(`Could not find coordinates for ${address}`);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };

  // Function to get route between two points
  const getRoute = async (startCoords: number[], endCoords: number[]) => {
    try {
      setLoadingRoute(true);
      const query = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?alternatives=true&geometries=geojson&steps=true&access_token=${mapboxToken}`;
      const response = await fetch(query);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        return data.routes;
      } else {
        throw new Error('No route found');
      }
    } catch (error) {
      console.error("Route error:", error);
      throw error;
    } finally {
      setLoadingRoute(false);
    }
  };

  // Update the map when the start/destination/route changes
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize the map if it hasn't been initialized yet
    if (!map.current) {
      mapboxgl.accessToken = mapboxToken;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [80.2706, 13.0827], // Default to Chennai
        zoom: 6
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('load', () => {
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error("Mapbox error:", e);
        setError("There was an error loading the map. Please check your connection.");
      });
    }
    
    // Add markers and route once map is loaded
    if (mapLoaded && map.current && start && destination && selectedRoute) {
      const loadRouteAndMarkers = async () => {
        try {
          // Remove existing markers and routes
          const existingStartMarker = document.querySelector('.start-marker');
          const existingEndMarker = document.querySelector('.end-marker');
          if (existingStartMarker) existingStartMarker.remove();
          if (existingEndMarker) existingEndMarker.remove();

          if (map.current?.getSource('route')) {
            map.current?.removeLayer('route-layer');
            map.current?.removeSource('route');
          }
          
          if (map.current?.getSource('tolls')) {
            map.current?.removeLayer('tolls-layer');
            map.current?.removeSource('tolls');
          }

          // Get coordinates for both addresses
          const startCoords = await geocodeAddress(start);
          const endCoords = await geocodeAddress(destination);
          
          // Create start marker element
          const startMarkerElement = document.createElement('div');
          startMarkerElement.className = 'start-marker';
          startMarkerElement.style.width = '25px';
          startMarkerElement.style.height = '25px';
          startMarkerElement.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDdiZmYiIGQ9Ik0xMiAwYy02LjYyMyAwLTEyIDUuMzc3LTEyIDEyczUuMzc3IDEyIDEyIDEyIDEyLTUuMzc3IDEyLTEyLTUuMzc3LTEyLTEyLTEyeiIvPjxwYXRoIGQ9Ik0xMyAxMnYtMmgtMnYyaC0ydjJoMnYyaDJ2LTJoMnYtMmgtMnoiIGZpbGw9IndoaXRlIi8+PC9zdmc+)';
          startMarkerElement.style.backgroundSize = '100%';
          
          // Create end marker element
          const endMarkerElement = document.createElement('div');
          endMarkerElement.className = 'end-marker';
          endMarkerElement.style.width = '25px';
          endMarkerElement.style.height = '25px';
          endMarkerElement.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNlNzFkMzYiIGQ9Ik0xMiAwYy02LjYyMyAwLTEyIDUuMzc3LTEyIDEyczUuMzc3IDEyIDEyIDEyIDEyLTUuMzc3IDEyLTEyLTUuMzc3LTEyLTEyLTEyeiIvPjxwYXRoIGQ9Ik0xOCA4aC0xMnY4aDEyeiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)';
          endMarkerElement.style.backgroundSize = '100%';

          // Add markers to the map
          new mapboxgl.Marker(startMarkerElement)
            .setLngLat(startCoords)
            .addTo(map.current);
          
          new mapboxgl.Marker(endMarkerElement)
            .setLngLat(endCoords)
            .addTo(map.current);

          // Get real routes from Mapbox API
          const routes = await getRoute(startCoords, endCoords);

          // Use the first route as our selected route
          const routeGeometry = routes[0].geometry;
          
          // Add the route to the map
          map.current?.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: routeGeometry
            }
          });
          
          map.current?.addLayer({
            id: 'route-layer',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': selectedRoute.isRecommended ? '#10b981' : '#0e8fe0',
              'line-width': 6,
              'line-opacity': 0.8
            }
          });
          
          // Add toll points if the route has tolls
          if (selectedRoute.tolls && selectedRoute.tolls.length > 0) {
            // Generate some points along the route for tolls
            const routeLength = routeGeometry.coordinates.length;
            const tollPoints = selectedRoute.tolls.map((toll: Toll, index: number) => {
              // Position tolls evenly along the route
              const position = Math.floor((index + 1) * routeLength / (selectedRoute.tolls.length + 1));
              return {
                type: 'Feature',
                properties: {
                  name: toll.name,
                  cost: toll.cost
                },
                geometry: {
                  type: 'Point',
                  coordinates: routeGeometry.coordinates[position]
                }
              };
            });
            
            map.current?.addSource('tolls', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: tollPoints
              }
            });
            
            map.current?.addLayer({
              id: 'tolls-layer',
              type: 'circle',
              source: 'tolls',
              paint: {
                'circle-radius': 6,
                'circle-color': '#f97316',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }
            });
            
            // Add popup for toll information
            map.current?.on('click', 'tolls-layer', (e) => {
              if (!e.features || e.features.length === 0) return;
              
              const coordinates = (e.features[0].geometry as any).coordinates.slice();
              const { name, cost } = e.features[0].properties;
              
              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`<strong>${name}</strong><br>Cost: ₹${cost}`)
                .addTo(map.current!);
            });
            
            // Change cursor on hover
            map.current?.on('mouseenter', 'tolls-layer', () => {
              if (map.current) map.current.getCanvas().style.cursor = 'pointer';
            });
            
            map.current?.on('mouseleave', 'tolls-layer', () => {
              if (map.current) map.current.getCanvas().style.cursor = '';
            });
          }

          // Fit the map to show both markers
          const bounds = new mapboxgl.LngLatBounds()
            .extend(startCoords)
            .extend(endCoords);
          
          map.current?.fitBounds(bounds, {
            padding: 80,
            maxZoom: 15,
            duration: 1000
          });
          
          toast({
            title: "Route loaded",
            description: `${start} to ${destination} - ${selectedRoute.distance}km`,
            duration: 3000,
          });
          
        } catch (err) {
          console.error("Error setting up route:", err);
          toast({
            title: "Error loading route",
            description: err.message || "Failed to display the route. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
          setError(err.message || "Failed to display the route");
        }
      };
      
      loadRouteAndMarkers();
    }
    
    // Cleanup
    return () => {
      if (map.current) {
        // map.current.remove();
      }
    };
  }, [start, destination, selectedRoute, mapLoaded, mapboxToken, vehicleType, goodsType, weight, toast]);

  // Custom token input for testing
  const handleTokenUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapbox-token') as string;
    
    if (token && token !== mapboxToken) {
      setMapboxToken(token);
      // Force re-initialization of map with new token
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapLoaded(false);
        setError(null);
        toast({
          title: "Mapbox token updated",
          description: "The map will reload with the new access token.",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full rounded-md overflow-hidden">
      {/* Token input section for testing */}
      {!MAPBOX_ACCESS_TOKEN && (
        <form onSubmit={handleTokenUpdate} className="p-2 bg-gray-100 dark:bg-gray-800 border-b">
          <div className="flex gap-2">
            <input 
              type="text" 
              name="mapbox-token" 
              placeholder="Enter Mapbox access token" 
              className="flex-1 px-2 py-1 text-sm rounded border" 
              defaultValue={mapboxToken}
            />
            <button type="submit" className="px-2 py-1 text-sm bg-blue-500 text-white rounded">Update</button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Get a token at mapbox.com</p>
        </form>
      )}
      
      <div className="relative w-full h-[calc(100%-2rem)] min-h-[400px]">
        {/* Map container */}
        <div 
          ref={mapContainer} 
          className="w-full h-full rounded-md"
        />
        
        {/* Loading indicator */}
        {(!mapLoaded || loadingRoute) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/70 dark:bg-gray-800/70">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 border-4 border-logistics-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-logistics-600 dark:text-logistics-400">
                {!mapLoaded ? 'Loading map...' : 'Finding optimal route...'}
              </p>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg max-w-md mx-4">
              <h3 className="text-red-600 font-medium mb-2">Error</h3>
              <p className="text-gray-700 dark:text-gray-300">{error}</p>
              <p className="text-sm text-gray-500 mt-2">
                Make sure you have a valid Mapbox token or check your internet connection.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
