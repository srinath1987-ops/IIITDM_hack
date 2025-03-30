const db = require('../config/db');
const supabase = require('../config/supabase');

/**
 * Save traffic data to PostgreSQL and Supabase
 * @param {Array} trafficData - Traffic data to save
 * @returns {Promise<Object>} - Result of the operation
 */
async function saveTrafficData(trafficData) {
  try {
    if (!trafficData || !Array.isArray(trafficData)) {
      return { success: false, error: 'Invalid traffic data' };
    }

    // Format the data for insertion
    const values = trafficData.map(data => ({
      lat: data.location?.lat || 0,
      lng: data.location?.lng || 0,
      congestion_level: data.congestion || 0,
      speed: data.speed || 0
    }));

    // MOCK: Just log instead of inserting into PostgreSQL
    console.log('MOCK: Would save traffic data to PostgreSQL:', values);
    
    /* Original PostgreSQL code
    const query = `
      INSERT INTO traffic_data (lat, lng, congestion_level, speed)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;

    const pgPromises = values.map(value => 
      db.query(query, [value.lat, value.lng, value.congestion_level, value.speed])
    );
    
    const pgResults = await Promise.all(pgPromises);
    */
    
    // MOCK: Just log instead of inserting into Supabase
    console.log('MOCK: Would save traffic data to Supabase:', values);
    
    /* Original Supabase code
    const { data, error } = await supabase
      .from('traffic_data')
      .insert(values);

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        error: error.message,
        pgResults
      };
    }
    */

    return {
      success: true,
      pgResults: [{ id: Math.floor(Math.random() * 1000) }],
      supabaseData: values
    };
  } catch (error) {
    console.error('Error saving traffic data:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Save route data to database
 * @param {Object} routeData - Route data to save
 * @returns {Promise<Object>} - Result of the operation
 */
async function saveRouteData(routeData) {
  try {
    if (!routeData) {
      return { success: false, error: 'Invalid route data' };
    }

    // MOCK: Just log instead of inserting into database
    console.log('MOCK: Would save route data to PostgreSQL:', routeData);

    /*
    // Insert route data
    const routeQuery = `
      INSERT INTO routes (
        start_lat, start_lng, end_lat, end_lng,
        distance, duration, route_geometry, traffic_level,
        route_type, toll_cost, vehicle_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id;
    `;

    const routeValues = [
      routeData.startLat,
      routeData.startLng,
      routeData.endLat,
      routeData.endLng,
      routeData.distance,
      routeData.duration,
      routeData.geometry,
      routeData.trafficLevel || 0,
      routeData.routeType || 'optimal',
      routeData.tollCost || 0,
      routeData.vehicleType || 'truck'
    ];

    const routeResult = await db.query(routeQuery, routeValues);
    const routeId = routeResult.rows[0]?.id;

    // Save toll points if available
    if (routeData.tollPoints && Array.isArray(routeData.tollPoints)) {
      const tollPromises = routeData.tollPoints.map(toll => {
        const tollQuery = `
          INSERT INTO toll_points (
            lat, lng, name, cost, currency, route_id
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id;
        `;

        const tollValues = [
          toll.lat,
          toll.lng,
          toll.name || 'Toll Booth',
          toll.cost || 0,
          toll.currency || 'INR',
          routeId
        ];

        return db.query(tollQuery, tollValues);
      });

      await Promise.all(tollPromises);
    }
    */

    const routeId = Math.floor(Math.random() * 1000);

    // MOCK: Just log instead of inserting into Supabase
    console.log('MOCK: Would save route data to Supabase:', routeData);

    /*
    // Insert into Supabase for real-time updates
    const { data, error } = await supabase
      .from('routes')
      .insert({
        id: routeId,
        start_lat: routeData.startLat,
        start_lng: routeData.startLng,
        end_lat: routeData.endLat,
        end_lng: routeData.endLng,
        distance: routeData.distance,
        duration: routeData.duration,
        route_geometry: routeData.geometry,
        traffic_level: routeData.trafficLevel || 0,
        route_type: routeData.routeType || 'optimal',
        toll_cost: routeData.tollCost || 0,
        vehicle_type: routeData.vehicleType || 'truck'
      });

    if (error) {
      console.error('Supabase error:', error);
    }
    */

    return {
      success: true,
      routeId,
      supabaseData: routeData
    };
  } catch (error) {
    console.error('Error saving route data:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Save road closure data to database
 * @param {Array} closureData - Road closure data to save
 * @returns {Promise<Object>} - Result of the operation
 */
async function saveRoadClosures(closureData) {
  try {
    if (!closureData || !Array.isArray(closureData)) {
      return { success: false, error: 'Invalid closure data' };
    }

    // MOCK: Just log instead of inserting into PostgreSQL
    console.log('MOCK: Would save road closures to PostgreSQL:', closureData);

    /*
    const closurePromises = closureData.map(closure => {
      const query = `
        INSERT INTO road_closures (
          lat, lng, reason, valid_from, valid_to
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;

      const now = new Date();
      const validFrom = now;
      const validTo = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

      const values = [
        closure.lat,
        closure.lng,
        closure.reason || 'Road closure',
        validFrom,
        validTo
      ];

      return db.query(query, values);
    });

    const results = await Promise.all(closurePromises);
    */

    // MOCK: Just log instead of inserting into Supabase
    console.log('MOCK: Would save road closures to Supabase:', closureData);

    /*
    // Insert into Supabase for real-time updates
    const supabaseData = closureData.map(closure => ({
      lat: closure.lat,
      lng: closure.lng,
      reason: closure.reason || 'Road closure',
      valid_from: new Date(),
      valid_to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }));

    const { data, error } = await supabase
      .from('road_closures')
      .insert(supabaseData);

    if (error) {
      console.error('Supabase error:', error);
    }
    */

    return {
      success: true,
      pgResults: [{ id: Math.floor(Math.random() * 1000) }],
      supabaseData: closureData
    };
  } catch (error) {
    console.error('Error saving road closures:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all routes between two points
 * @param {number} startLat - Start latitude
 * @param {number} startLng - Start longitude
 * @param {number} endLat - End latitude
 * @param {number} endLng - End longitude
 * @returns {Promise<Object>} - Route data
 */
async function getRoutes(startLat, startLng, endLat, endLng) {
  try {
    // MOCK: Return empty array instead of querying database
    console.log('MOCK: Would query routes from database:', { startLat, startLng, endLat, endLng });
    
    /*
    const query = `
      SELECT *
      FROM routes
      WHERE 
        start_lat = $1 AND start_lng = $2 AND
        end_lat = $3 AND end_lng = $4
      ORDER BY created_at DESC
      LIMIT 5;
    `;

    const result = await db.query(query, [startLat, startLng, endLat, endLng]);
    */

    return {
      success: true,
      routes: [] // Return empty array to force API calls for routes
    };
  } catch (error) {
    console.error('Error getting routes:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export methods
module.exports = {
  saveTrafficData,
  saveRouteData,
  saveRoadClosures,
  getRoutes
}; 