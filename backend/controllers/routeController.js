const graphHopperService = require('../services/graphHopperService');
const osrmService = require('../services/osrmService');
const tollGuruService = require('../services/tollGuruService');
const mapMyIndiaService = require('../services/mapMyIndiaService');
const openStreetMapService = require('../services/openStreetMapService');
const dbService = require('../services/dbService');

/**
 * Get optimal routes for trucks with traffic data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getOptimalTruckRoutes(req, res) {
  try {
    const { startLat, startLng, endLat, endLng } = req.query;

    // Validate input
    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startLat, startLng, endLat, endLng'
      });
    }

    // Skip database check and go directly to API calls
    // Get routes from GraphHopper
    let routesResult = await graphHopperService.getTruckRoutes(
      parseFloat(startLat),
      parseFloat(startLng),
      parseFloat(endLat),
      parseFloat(endLng)
    );

    // If GraphHopper fails, try OSRM as fallback
    if (!routesResult.success) {
      console.log('GraphHopper failed, trying OSRM...');
      routesResult = await osrmService.getTruckRoutes(
        parseFloat(startLat),
        parseFloat(startLng),
        parseFloat(endLat),
        parseFloat(endLng)
      );
    }

    if (!routesResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to get routes from all providers'
      });
    }

    // Get toll information
    const tollData = await tollGuruService.getTollInfo(
      routesResult.routes[0].points,
      'truck'
    );

    // Add toll data to route
    const routesWithTolls = routesResult.routes.map(route => ({
      ...route,
      hasTolls: tollData.hasTolls || false,
      tollCost: tollData.cost || 0,
      tollCurrency: tollData.currency || 'INR',
      tollPoints: tollData.points || []
    }));

    // Get traffic data for each route
    const trafficPromises = routesWithTolls.map(route => {
      // Get center point of the route for traffic query
      const points = route.points || [];
      const midIndex = Math.floor(points.length / 2);
      const midPoint = points[midIndex] || { lat: startLat, lng: startLng };

      return mapMyIndiaService.getTrafficData(midPoint.lat, midPoint.lng);
    });

    const trafficResults = await Promise.all(trafficPromises);

    // Add traffic data to routes
    const routesWithTraffic = routesWithTolls.map((route, index) => {
      const trafficData = trafficResults[index] || { congestion: 0 };
      return {
        ...route,
        trafficLevel: trafficData.congestion || 0,
        trafficData: trafficData.details || []
      };
    });

    // Get road closure data around the routes
    const closureResult = await openStreetMapService.getRoadClosures(
      parseFloat(startLat),
      parseFloat(startLng),
      parseFloat(endLat),
      parseFloat(endLng)
    );

    // Log instead of saving to database
    console.log('MOCK: Would save routes to database:', routesWithTraffic[0]);

    // Save road closures if available
    if (closureResult.success && closureResult.closures && closureResult.closures.length > 0) {
      console.log('MOCK: Would save road closures to database:', closureResult.closures);
    }

    // Send the enriched routes to the client
    res.json({
      success: true,
      source: 'api',
      routes: routesWithTraffic,
      closures: closureResult.success ? closureResult.closures : [],
      hasTolls: tollData.hasTolls || false
    });
  } catch (error) {
    console.error('Error in getOptimalTruckRoutes:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}

/**
 * Get traffic data for an area
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getTrafficData(req, res) {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: lat, lng'
      });
    }

    const trafficData = await mapMyIndiaService.getTrafficData(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius) || 5000
    );

    // Log instead of saving to database
    if (trafficData && trafficData.details) {
      console.log('MOCK: Would save traffic data to database:', trafficData.details);
    }

    res.json({
      success: true,
      data: trafficData
    });
  } catch (error) {
    console.error('Error in getTrafficData:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}

/**
 * Get road closure information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getRoadClosures(req, res) {
  try {
    const { startLat, startLng, endLat, endLng } = req.query;

    if (!startLat || !startLng) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: startLat, startLng'
      });
    }

    // If no end coordinates, use startLat/startLng as center and get closures around it
    const closureData = await openStreetMapService.getRoadClosures(
      parseFloat(startLat),
      parseFloat(startLng),
      parseFloat(endLat) || null,
      parseFloat(endLng) || null
    );

    // Log instead of saving to database
    if (closureData && closureData.closures) {
      console.log('MOCK: Would save road closures to database:', closureData.closures);
    }

    res.json(closureData);
  } catch (error) {
    console.error('Error in getRoadClosures:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}

/**
 * Get toll information for a route
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getTollInfo(req, res) {
  try {
    const { points, vehicleType } = req.body;

    if (!points || !Array.isArray(points)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid required parameters: points must be an array'
      });
    }

    const tollInfo = await tollGuruService.getTollInfo(
      points,
      vehicleType || 'truck'
    );

    res.json(tollInfo);
  } catch (error) {
    console.error('Error in getTollInfo:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}

module.exports = {
  getOptimalTruckRoutes,
  getTrafficData,
  getRoadClosures,
  getTollInfo
}; 