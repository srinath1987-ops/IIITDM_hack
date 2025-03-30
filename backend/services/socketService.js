const { Server } = require('socket.io');
const supabase = require('../config/supabase');
const mapMyIndiaService = require('./mapMyIndiaService');

let io;

/**
 * Initialize WebSocket server
 * @param {Object} httpServer - HTTP server instance
 */
function initialize(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', socket => {
    console.log('Client connected:', socket.id);

    // Subscribe to route updates
    socket.on('subscribe:route', data => {
      if (data && data.startLat && data.startLng && data.endLat && data.endLng) {
        console.log(`Client ${socket.id} subscribed to route updates`);
        socket.join(`route:${data.startLat},${data.startLng},${data.endLat},${data.endLng}`);
      }
    });

    // Subscribe to traffic updates for a specific area
    socket.on('subscribe:traffic', data => {
      if (data && data.lat && data.lng && data.radius) {
        console.log(`Client ${socket.id} subscribed to traffic updates`);
        socket.join(`traffic:${data.lat},${data.lng},${data.radius}`);
        
        // Start sending periodic traffic updates
        startTrafficUpdates(socket, data);
      }
    });

    // Subscribe to road closure updates
    socket.on('subscribe:closures', data => {
      if (data && data.lat && data.lng) {
        console.log(`Client ${socket.id} subscribed to closure updates`);
        socket.join(`closures:${data.lat},${data.lng}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Use mock data instead of Supabase real-time updates
  setupMockRealTime();

  console.log('WebSocket server initialized');
  return io;
}

/**
 * Set up mock real-time data generation instead of Supabase subscriptions
 */
function setupMockRealTime() {
  console.log('Setting up mock real-time data updates');
  
  // Create interval to simulate traffic updates
  setInterval(() => {
    if (!io) return;
    
    // Generate random traffic data
    const mockTrafficData = {
      id: Math.floor(Math.random() * 1000),
      lat: 18.52 + (Math.random() * 0.1),
      lng: 73.85 + (Math.random() * 0.1),
      congestion_level: Math.floor(Math.random() * 10),
      speed: 20 + Math.floor(Math.random() * 60),
      timestamp: new Date().toISOString()
    };
    
    // Broadcast to all traffic rooms
    Object.keys(io.sockets.adapter.rooms).forEach(room => {
      if (room.startsWith('traffic:')) {
        io.to(room).emit('traffic:update', mockTrafficData);
      }
    });
  }, 30000); // Every 30 seconds
  
  // Create interval to simulate road closure updates
  setInterval(() => {
    if (!io) return;
    
    // Generate random closure data
    const mockClosureData = {
      id: Math.floor(Math.random() * 1000),
      lat: 18.52 + (Math.random() * 0.1),
      lng: 73.85 + (Math.random() * 0.1),
      reason: 'Road maintenance',
      valid_from: new Date().toISOString(),
      valid_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    // Broadcast to all closure rooms
    Object.keys(io.sockets.adapter.rooms).forEach(room => {
      if (room.startsWith('closures:')) {
        io.to(room).emit('closures:update', mockClosureData);
      }
    });
  }, 60000); // Every minute
}

/**
 * Start sending periodic traffic updates to a client
 * @param {Object} socket - Socket.io socket
 * @param {Object} data - Subscription data (lat, lng, radius)
 */
function startTrafficUpdates(socket, data) {
  // Set up a timer to periodically fetch and send traffic updates
  // In a production app, you'd use a more sophisticated approach
  const updateInterval = setInterval(async () => {
    try {
      // Check if the socket is still connected
      if (!socket.connected) {
        clearInterval(updateInterval);
        return;
      }

      // Get traffic data from MapMyIndia
      const trafficData = await mapMyIndiaService.getTrafficData(data.lat, data.lng);
      
      // Send update to this specific client
      socket.emit('traffic:live', {
        timestamp: new Date(),
        data: trafficData
      });
    } catch (error) {
      console.error('Error fetching traffic updates:', error.message);
    }
  }, 60000); // Update every minute

  // Clean up interval when the socket disconnects
  socket.on('disconnect', () => {
    clearInterval(updateInterval);
  });
}

/**
 * Broadcast a message to all connected clients
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
function broadcast(event, data) {
  if (io) {
    io.emit(event, data);
  }
}

/**
 * Broadcast an update about a route
 * @param {Object} routeData - Route data
 */
function broadcastRouteUpdate(routeData) {
  if (io && routeData) {
    const roomName = `route:${routeData.startLat},${routeData.startLng},${routeData.endLat},${routeData.endLng}`;
    io.to(roomName).emit('route:update', routeData);
  }
}

/**
 * Broadcast traffic information to all clients in an area
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in meters
 * @param {Object} trafficData - Traffic data
 */
function broadcastTrafficUpdate(lat, lng, radius, trafficData) {
  if (io && trafficData) {
    const roomName = `traffic:${lat},${lng},${radius}`;
    io.to(roomName).emit('traffic:update', trafficData);
  }
}

module.exports = {
  initialize,
  broadcast,
  broadcastRouteUpdate,
  broadcastTrafficUpdate
}; 