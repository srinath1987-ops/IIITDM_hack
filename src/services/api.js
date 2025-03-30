import axios from 'axios';
import { mockRoutes } from '../mocks/routeData';
import { mockTrafficData } from '../mocks/trafficData';
import { mockClosures } from '../mocks/closureData';

// Use environment variables for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    // If the server is unreachable, error.response will be undefined
    if (!error.response) {
      console.error('Server is unreachable');
    }
    return Promise.reject(error);
  }
);

/**
 * Get optimized truck routes between two points
 * @param {number} startLat - Start latitude
 * @param {number} startLng - Start longitude
 * @param {number} endLat - End latitude
 * @param {number} endLng - End longitude
 * @returns {Promise<Object>} - Route data
 */
export const getRoutes = async (startLat, startLng, endLat, endLng) => {
  try {
    console.log(`Fetching routes from ${startLat},${startLng} to ${endLat},${endLng}`);
    
    const response = await api.get('/routes', {
      params: {
        startLat,
        startLng,
        endLat,
        endLng
      }
    });
    
    console.log('Routes API response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data;
    } else {
      console.warn('Routes API returned non-success response, using mock data');
      return {
        success: true,
        routes: mockRoutes,
        closures: mockClosures
      };
    }
  } catch (error) {
    console.error('Error fetching routes:', error);
    // Fall back to mock data if API call fails
    console.log('Using mock route data due to API error');
    return {
      success: true,
      routes: mockRoutes,
      closures: mockClosures
    };
  }
};

/**
 * Get traffic data for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} - Traffic data
 */
export const getTrafficData = async (lat, lng, radius) => {
  try {
    console.log(`Fetching traffic data around ${lat},${lng} with radius ${radius}`);
    
    const response = await api.get('/traffic', {
      params: {
        lat,
        lng,
        radius
      }
    });
    
    console.log('Traffic API response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data;
    } else {
      console.warn('Traffic API returned non-success response, using mock data');
      return {
        success: true,
        data: mockTrafficData
      };
    }
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    // Fall back to mock data if API call fails
    return {
      success: true,
      data: mockTrafficData
    };
  }
};

/**
 * Get road closures near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Object>} - Road closure data
 */
export const getRoadClosures = async (lat, lng, radius) => {
  try {
    console.log(`Fetching road closures around ${lat},${lng} with radius ${radius}`);
    
    const response = await api.get('/closures', {
      params: {
        lat,
        lng,
        radius
      }
    });
    
    console.log('Closures API response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data;
    } else {
      console.warn('Closures API returned non-success response, using mock data');
      return {
        success: true,
        closures: mockClosures
      };
    }
  } catch (error) {
    console.error('Error fetching road closures:', error);
    // Fall back to mock data if API call fails
    return {
      success: true,
      closures: mockClosures
    };
  }
};

/**
 * Get toll information for a route
 * @param {Array<{lat: number, lng: number}>} points - Route points
 * @param {string} vehicleType - Vehicle type (default: 'truck')
 * @returns {Promise<Object>} - Toll information
 */
export const getTollInfo = async (routeGeometry) => {
  try {
    console.log('Fetching toll information for route');
    
    const response = await api.post('/tolls', {
      geometry: routeGeometry
    });
    
    console.log('Tolls API response:', response.data);
    
    if (response.data && response.data.success) {
      return response.data;
    } else {
      console.warn('Tolls API returned non-success response, using mock data');
      return {
        success: true,
        tolls: []
      };
    }
  } catch (error) {
    console.error('Error fetching toll information:', error);
    // Fall back to empty toll data if API call fails
    return {
      success: true,
      tolls: []
    };
  }
};

export default {
  getRoutes,
  getTrafficData,
  getRoadClosures,
  getTollInfo
}; 