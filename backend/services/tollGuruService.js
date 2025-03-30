const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const TOLLGURU_API_KEY = process.env.TOLLGURU_API_KEY;
const TOLLGURU_BASE_URL = 'https://dev.tollguru.com/v1';

/**
 * Get toll information for a route
 * @param {Array<{lat: number, lng: number}>} waypoints - Route waypoints
 * @param {string} vehicleType - Vehicle type (car, truck, etc.)
 * @returns {Promise<Object>} - Toll information
 */
async function getTollInfo(waypoints, vehicleType = 'truck') {
  try {
    const coordinates = waypoints.map(point => ({
      latitude: point.lat,
      longitude: point.lng
    }));

    const payload = {
      source: 'osrm',
      vehicleType,
      departure_time: new Date().toISOString(),
      path: coordinates
    };

    const response = await axios.post(
      `${TOLLGURU_BASE_URL}/calc/gps`,
      payload,
      {
        headers: {
          'x-api-key': TOLLGURU_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data) {
      return {
        success: true,
        summary: {
          totalCost: response.data.summary?.totalCost || 0,
          currency: response.data.summary?.currency || 'INR',
          cashCost: response.data.summary?.cashCost || 0,
          tagCost: response.data.summary?.tagCost || 0
        },
        tolls: response.data.tolls || [],
        hasTolls: (response.data.tolls && response.data.tolls.length > 0) || false
      };
    }

    return {
      success: false,
      error: 'No toll data found',
      hasTolls: false
    };
  } catch (error) {
    console.error('Error fetching toll information:', error.message);
    return {
      success: false,
      error: error.message,
      hasTolls: false
    };
  }
}

/**
 * Convert polyline to waypoints for toll calculation
 * @param {string} polyline - Encoded polyline
 * @returns {Array<{lat: number, lng: number}>} - Array of waypoints
 */
function polylineToWaypoints(polyline) {
  // This would normally use a polyline decoder library
  // For simplicity, we'll just return a mock implementation
  
  // In a real app, use a library like @mapbox/polyline to decode
  // return polyline.decode(encodedPolyline).map(point => ({
  //   lat: point[0],
  //   lng: point[1]
  // }));
  
  // Mock implementation
  return [
    { lat: 13.0827, lng: 80.2707 }, // Chennai
    { lat: 15.3173, lng: 75.7139 }, // Middle point
    { lat: 19.0760, lng: 72.8777 }  // Mumbai
  ];
}

module.exports = {
  getTollInfo,
  polylineToWaypoints
}; 