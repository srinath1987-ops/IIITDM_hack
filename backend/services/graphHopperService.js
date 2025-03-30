const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GRAPHHOPPER_API_KEY = process.env.GRAPHHOPPER_API_KEY;
const GRAPHHOPPER_BASE_URL = 'https://graphhopper.com/api/1';

/**
 * Get optimized routes for trucks
 * @param {number} startLat - Start latitude
 * @param {number} startLng - Start longitude
 * @param {number} endLat - End latitude
 * @param {number} endLng - End longitude
 * @param {object} options - Additional options
 * @returns {Promise<Object>} - Optimized routes
 */
async function getTruckRoutes(startLat, startLng, endLat, endLng, options = {}) {
  try {
    const payload = {
      points: [
        [startLng, startLat],
        [endLng, endLat]
      ],
      vehicle: 'truck',
      algorithm: 'alternative_route',
      alternative_route: {
        max_paths: 3,
        max_weight_factor: 1.5,
        max_share_factor: 0.8
      },
      details: ['road_class', 'surface', 'toll'],
      instructions: true,
      calc_points: true,
      points_encoded: true,
      ...options
    };

    const response = await axios.post(
      `${GRAPHHOPPER_BASE_URL}/route?key=${GRAPHHOPPER_API_KEY}`,
      payload
    );

    if (response.data && response.data.paths) {
      return {
        success: true,
        routes: response.data.paths.map(path => ({
          distance: path.distance,
          duration: path.time / 1000, // Convert to seconds
          geometry: path.points, // Encoded polyline
          tollCost: calculateTollCost(path),
          instructions: path.instructions,
          ascend: path.ascend,
          descend: path.descend,
          snappedWaypoints: path.snapped_waypoints
        }))
      };
    }

    return { 
      success: false,
      error: 'No routes found',
      fallbackToOSRM: true
    };
  } catch (error) {
    console.error('Error fetching GraphHopper routes:', error.message);
    return { 
      success: false,
      error: error.message,
      fallbackToOSRM: true
    };
  }
}

/**
 * Calculate estimated toll cost from GraphHopper response
 * This is a simplified approximation - in production, use TollGuru API
 * @param {Object} path - GraphHopper path object
 * @returns {number} - Estimated toll cost
 */
function calculateTollCost(path) {
  if (!path.details || !path.details.toll) {
    return 0;
  }

  // Simple implementation - in production, use more sophisticated logic
  // This counts toll segments and multiplies by a factor
  let tollSegments = 0;
  path.details.toll.forEach(segment => {
    if (segment[2] === true) {
      tollSegments++;
    }
  });

  // Arbitrary pricing - in production, use TollGuru API
  return tollSegments * 50; // 50 INR per toll segment
}

module.exports = {
  getTruckRoutes
}; 