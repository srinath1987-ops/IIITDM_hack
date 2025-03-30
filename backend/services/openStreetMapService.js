const axios = require('axios');

/**
 * Query Overpass API for road closures
 * @param {number} lat - Center latitude
 * @param {number} lng - Center longitude
 * @param {number} radius - Search radius in meters (default: 5000)
 * @returns {Promise<Object>} - Road closures and restrictions
 */
async function getRoadClosures(lat, lng, radius = 5000) {
  try {
    // Overpass query to find roads with restrictions
    const overpassQuery = `
      [out:json];
      (
        way["highway"]["access"="no"](around:${radius},${lat},${lng});
        way["highway"]["vehicle"="no"](around:${radius},${lat},${lng});
        way["highway"]["hgv"="no"](around:${radius},${lat},${lng});
        way["maxheight"](around:${radius},${lat},${lng});
        way["maxweight"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      overpassQuery,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.elements) {
      // Process and format the response
      return {
        success: true,
        closures: processRoadClosures(response.data.elements)
      };
    }

    return {
      success: false,
      error: 'No road closure data found'
    };
  } catch (error) {
    console.error('Error fetching road closures:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Process and format road closure data
 * @param {Array} elements - OSM elements
 * @returns {Array} - Formatted road closures
 */
function processRoadClosures(elements) {
  // First, extract the nodes
  const nodes = {};
  elements.forEach(element => {
    if (element.type === 'node') {
      nodes[element.id] = {
        lat: element.lat,
        lng: element.lon
      };
    }
  });

  // Then, process the ways (roads)
  const closures = [];
  elements.forEach(element => {
    if (element.type === 'way' && element.tags) {
      // Get coordinates for the way
      const coords = element.nodes
        .map(nodeId => nodes[nodeId])
        .filter(node => node); // Filter out undefined nodes

      if (coords.length > 0) {
        // Calculate center point of the way
        const centerLat = coords.reduce((sum, node) => sum + node.lat, 0) / coords.length;
        const centerLng = coords.reduce((sum, node) => sum + node.lng, 0) / coords.length;

        // Generate a reason based on the tags
        let reason = 'Road restriction';
        if (element.tags.access === 'no') reason = 'No access';
        if (element.tags.vehicle === 'no') reason = 'No vehicles allowed';
        if (element.tags.hgv === 'no') reason = 'No heavy goods vehicles';
        if (element.tags.maxheight) reason = `Height limit: ${element.tags.maxheight}`;
        if (element.tags.maxweight) reason = `Weight limit: ${element.tags.maxweight}`;

        closures.push({
          id: element.id,
          lat: centerLat,
          lng: centerLng,
          name: element.tags.name || 'Unnamed road',
          reason,
          tags: element.tags,
          points: coords
        });
      }
    }
  });

  return closures;
}

/**
 * Check if a route has any road closures
 * @param {Array<{lat: number, lng: number}>} routePoints - Route coordinates
 * @returns {Promise<Object>} - Road closure check results
 */
async function checkRouteForClosures(routePoints) {
  try {
    if (!routePoints || routePoints.length === 0) {
      return {
        success: false,
        error: 'No route points provided'
      };
    }

    // Sample points along the route to check
    const samplePoints = sampleRoutePoints(routePoints, 5);
    
    // Query closures for each sample point
    const closurePromises = samplePoints.map(point => 
      getRoadClosures(point.lat, point.lng, 100)
    );

    const closureResults = await Promise.all(closurePromises);
    
    // Aggregate all closures
    const allClosures = [];
    closureResults.forEach(result => {
      if (result.success && result.closures) {
        allClosures.push(...result.closures);
      }
    });

    // Remove duplicates by ID
    const uniqueClosures = [...new Map(allClosures.map(c => [c.id, c])).values()];

    return {
      success: true,
      hasClosures: uniqueClosures.length > 0,
      closures: uniqueClosures
    };
  } catch (error) {
    console.error('Error checking route for closures:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Sample points along a route
 * @param {Array<{lat: number, lng: number}>} routePoints - Route coordinates
 * @param {number} numSamples - Number of points to sample
 * @returns {Array<{lat: number, lng: number}>} - Sampled points
 */
function sampleRoutePoints(routePoints, numSamples) {
  if (routePoints.length <= numSamples) {
    return routePoints;
  }

  const result = [];
  const step = Math.floor(routePoints.length / numSamples);
  
  for (let i = 0; i < numSamples; i++) {
    const index = Math.min(i * step, routePoints.length - 1);
    result.push(routePoints[index]);
  }

  return result;
}

module.exports = {
  getRoadClosures,
  checkRouteForClosures
}; 