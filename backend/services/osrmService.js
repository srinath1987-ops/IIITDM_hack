const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OSRM_BASE_URL = process.env.OSRM_BASE_URL || 'http://router.project-osrm.org';

/**
 * Get truck routes using OSRM
 * @param {number} startLat - Start latitude
 * @param {number} startLng - Start longitude
 * @param {number} endLat - End latitude
 * @param {number} endLng - End longitude
 * @param {object} options - Additional options
 * @returns {Promise<Object>} - Route data
 */
async function getTruckRoutes(startLat, startLng, endLat, endLng, options = {}) {
  try {
    const params = {
      alternatives: true,
      steps: true,
      geometries: 'polyline',
      overview: 'full',
      annotations: true,
      ...options
    };

    // OSRM expects coordinates as lng,lat
    const coordinates = `${startLng},${startLat};${endLng},${endLat}`;
    
    const response = await axios.get(
      `${OSRM_BASE_URL}/route/v1/driving/${coordinates}`,
      { params }
    );

    if (response.data && response.data.routes) {
      return {
        success: true,
        routes: response.data.routes.map(route => ({
          distance: route.distance,
          duration: route.duration,
          geometry: route.geometry, // Encoded polyline
          tollCost: 0, // OSRM doesn't provide toll info
          legs: route.legs,
          weight: route.weight,
          weight_name: route.weight_name
        }))
      };
    }

    return { 
      success: false,
      error: 'No routes found'
    };
  } catch (error) {
    console.error('Error fetching OSRM routes:', error.message);
    return { 
      success: false,
      error: error.message
    };
  }
}

/**
 * Get alternative routes with different transportation modes
 * @param {number} startLat - Start latitude
 * @param {number} startLng - Start longitude
 * @param {number} endLat - End latitude
 * @param {number} endLng - End longitude
 * @returns {Promise<Object>} - Multiple route options
 */
async function getMultiModalRoutes(startLat, startLng, endLat, endLng) {
  try {
    // Get routes for different profiles
    const profiles = ['driving', 'driving-hgv'];
    const routePromises = profiles.map(profile => {
      const coordinates = `${startLng},${startLat};${endLng},${endLat}`;
      return axios.get(`${OSRM_BASE_URL}/route/v1/${profile}/${coordinates}?alternatives=true&overview=full`);
    });

    const responses = await Promise.all(routePromises);
    
    // Combine and format the results
    const allRoutes = [];
    responses.forEach((response, index) => {
      if (response.data && response.data.routes) {
        const profile = profiles[index];
        response.data.routes.forEach(route => {
          allRoutes.push({
            profile,
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry
          });
        });
      }
    });

    if (allRoutes.length > 0) {
      return {
        success: true,
        routes: allRoutes
      };
    }

    return { 
      success: false,
      error: 'No routes found' 
    };
  } catch (error) {
    console.error('Error fetching multi-modal routes:', error.message);
    return { 
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  getTruckRoutes,
  getMultiModalRoutes
}; 