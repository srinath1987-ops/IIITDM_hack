const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const MAPMYINDIA_API_KEY = process.env.MAPMYINDIA_API_KEY;
const MAPMYINDIA_CLIENT_ID = process.env.MAPMYINDIA_CLIENT_ID;
const MAPMYINDIA_CLIENT_SECRET = process.env.MAPMYINDIA_CLIENT_SECRET;

let authToken = null;
let tokenExpiry = null;

/**
 * Get authentication token for MapMyIndia APIs using client credentials
 * @returns {Promise<string>} - Auth token
 */
async function getAuthToken() {
  try {
    // Return existing token if still valid
    if (authToken && tokenExpiry && new Date() < tokenExpiry) {
      return authToken;
    }

    // If no client credentials available, return null (will use REST API key instead)
    if (!MAPMYINDIA_CLIENT_ID || !MAPMYINDIA_CLIENT_SECRET) {
      console.log('No MapMyIndia client credentials found');
      return null;
    }

    console.log('Getting MapMyIndia auth token...');
    const response = await axios.post(
      'https://outpost.mapmyindia.com/api/security/oauth/token',
      {
        grant_type: 'client_credentials',
        client_id: MAPMYINDIA_CLIENT_ID,
        client_secret: MAPMYINDIA_CLIENT_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.access_token) {
      authToken = response.data.access_token;
      // Set expiry to 10 minutes before actual expiry for safety
      tokenExpiry = new Date(Date.now() + (response.data.expires_in - 600) * 1000);
      return authToken;
    }

    return null;
  } catch (error) {
    console.error('Error getting MapMyIndia auth token:', error.message);
    return null;
  }
}

/**
 * Get traffic data for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in meters (default: 1000)
 * @returns {Promise<Object>} - Traffic data
 */
async function getTrafficData(lat, lng, radius = 1000) {
  try {
    console.log(`Getting traffic data for ${lat},${lng} with radius ${radius}m`);
    
    // Always generate mock data, but continue with API call if credentials exist
    const mockData = getMockTrafficData(lat, lng);
    
    // If no API key, return mock data only
    if (!MAPMYINDIA_API_KEY && !MAPMYINDIA_CLIENT_ID) {
      console.log('No MapMyIndia credentials found, returning mock data');
      return mockData;
    }
    
    // Try to get auth token if client credentials available
    const token = await getAuthToken();
    
    // Determine which authentication method to use
    let headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    let url = '';
    let params = {};
    
    if (token) {
      // Use OAuth with client credentials
      url = 'https://apis.mapmyindia.com/advancedmaps/v1/traffic_path';
      headers['Authorization'] = `Bearer ${token}`;
      params = {
        center: `${lat},${lng}`,
        radius: radius,
        region: 'IND'
      };
    } else if (MAPMYINDIA_API_KEY) {
      // Use REST API key
      url = `https://apis.mapmyindia.com/advancedmaps/v1/${MAPMYINDIA_API_KEY}/traffic_path`;
      params = {
        center: `${lat},${lng}`,
        radius: radius,
        region: 'IND'
      };
    } else {
      // No valid auth method
      return mockData;
    }
    
    // Make API request
    try {
      const response = await axios.get(url, { params, headers });
      
      if (response.data && response.data.results) {
        return {
          success: true,
          congestion: getCongestionLevel(response.data.results),
          details: response.data.results,
          source: 'mapmyindia'
        };
      }
    } catch (apiError) {
      console.error('MapMyIndia API error:', apiError.message);
      // Fall back to mock data on error
    }
    
    // If we get here, either API call failed or returned no data
    console.log('Using mock traffic data');
    return mockData;
  } catch (error) {
    console.error('Error fetching MapMyIndia traffic data:', error.message);
    // Fall back to mock data on error
    console.log('Falling back to mock traffic data');
    return getMockTrafficData(lat, lng);
  }
}

/**
 * Get traffic data along a route
 * @param {Array<{lat: number, lng: number}>} waypoints - Array of coordinates
 * @returns {Promise<Array>} - Traffic data along route
 */
async function getRouteTrafficData(waypoints) {
  try {
    // For production, use a proper algorithm to sample points along the route
    // For demo, we'll just get traffic at each waypoint
    const trafficPromises = waypoints.map(point => getTrafficData(point.lat, point.lng));
    const trafficResults = await Promise.all(trafficPromises);
    
    return trafficResults.map((result, index) => ({
      ...result,
      location: waypoints[index]
    }));
  } catch (error) {
    console.error('Error fetching route traffic data:', error.message);
    // Return mock data on error
    return waypoints.map(point => ({
      ...getMockTrafficData(point.lat, point.lng),
      location: point
    }));
  }
}

/**
 * Generate mock traffic data for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} - Mock traffic data
 */
function getMockTrafficData(lat, lng) {
  // Generate random congestion level between 1-10
  const congestion = Math.floor(Math.random() * 10) + 1;
  
  // Random speed based on congestion (higher congestion = lower speed)
  const speed = Math.max(10, 80 - (congestion * 7));
  
  // Mock data structure similar to what MapMyIndia would return
  return {
    success: true,
    congestion: congestion,
    details: [
      {
        lat: lat,
        lng: lng,
        congestion_level: congestion,
        speed: speed,
        road_name: 'Mock Road',
        direction: 'both',
        timestamp: new Date().toISOString()
      }
    ],
    source: 'mock'
  };
}

/**
 * Calculate average congestion level from traffic data
 * @param {Array} trafficData - Traffic data points
 * @returns {number} - Average congestion level (0-10)
 */
function getCongestionLevel(trafficData) {
  if (!trafficData || !trafficData.length) return 0;
  
  let sum = 0;
  trafficData.forEach(point => {
    sum += point.congestion_level || 0;
  });
  
  return Math.round(sum / trafficData.length);
}

module.exports = {
  getTrafficData,
  getRouteTrafficData
}; 