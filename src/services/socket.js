import { io } from 'socket.io-client';
import { mockTrafficData } from '../mocks/trafficData';
import { mockRoutes } from '../mocks/routeData';
import { mockClosures } from '../mocks/closureData';

// Use environment variables for socket URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Keep track of connection status
let isConnected = false;
let socket = null;
let useMockData = false;

// Keep track of active subscriptions for cleanup
const activeSubscriptions = {
  traffic: [],
  routes: [],
  closures: []
};

// Mock intervals for simulating real-time events
let mockTrafficInterval = null;
let mockRouteInterval = null;
let mockClosureInterval = null;

/**
 * Connect to the WebSocket server
 */
export const connect = () => {
  try {
    console.log(`Attempting to connect to socket server at ${SOCKET_URL}`);
    
    // Create socket connection
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    // Handle connection events
    socket.on('connect', () => {
      console.log('Connected to real-time updates server');
      isConnected = true;
    });
    
    socket.on('connect_error', (error) => {
      console.warn('Socket connection error:', error.message);
      
      // If we can't connect to the real socket server, use mock data
      if (!isConnected && !useMockData) {
        console.log('Falling back to mock data for real-time updates');
        useMockData = true;
        setupMockSocketEvents();
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from real-time updates server');
      isConnected = false;
    });
    
  } catch (error) {
    console.error('Error setting up socket connection:', error);
    
    // Fall back to mock data
    if (!useMockData) {
      console.log('Falling back to mock data for real-time updates');
      useMockData = true;
      setupMockSocketEvents();
    }
  }
};

/**
 * Disconnect from the WebSocket server
 */
export const disconnect = () => {
  cleanupMockIntervals();
  
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

/**
 * Subscribe to traffic updates for a specific area
 */
export const subscribeToTrafficUpdates = (lat, lng, radius, callback) => {
  if (!callback) return;
  
  // Add to active subscriptions for cleanup
  activeSubscriptions.traffic.push({
    callback,
    params: { lat, lng, radius }
  });
  
  if (useMockData) {
    // Set up interval to periodically send mock traffic updates
    if (!mockTrafficInterval) {
      mockTrafficInterval = setInterval(() => {
        simulateTrafficUpdate();
      }, 10000); // Every 10 seconds
      
      // Initial update
      setTimeout(() => {
        simulateTrafficUpdate();
      }, 1000);
    }
    return;
  }
  
  if (isConnected && socket) {
    socket.emit('subscribe:traffic', { lat, lng, radius });
    
    // Set up event listener for traffic updates
    socket.on('traffic:update', (data) => {
      callback(data);
    });
  }
};

/**
 * Subscribe to route updates for a specific route
 */
export const subscribeToRouteUpdates = (startLat, startLng, endLat, endLng, callback) => {
  if (!callback) return;
  
  // Add to active subscriptions for cleanup
  activeSubscriptions.routes.push({
    callback,
    params: { startLat, startLng, endLat, endLng }
  });
  
  if (useMockData) {
    // Set up interval to periodically send mock route updates
    if (!mockRouteInterval) {
      mockRouteInterval = setInterval(() => {
        simulateRouteUpdate();
      }, 15000); // Every 15 seconds
    }
    return;
  }
  
  if (isConnected && socket) {
    socket.emit('subscribe:route', { startLat, startLng, endLat, endLng });
    
    // Set up event listener for route updates
    socket.on('route:update', (data) => {
      callback(data);
    });
  }
};

/**
 * Subscribe to road closure updates for a specific area
 */
export const subscribeToClosureUpdates = (lat, lng, callback) => {
  if (!callback) return;
  
  // Add to active subscriptions for cleanup
  activeSubscriptions.closures.push({
    callback,
    params: { lat, lng }
  });
  
  if (useMockData) {
    // Set up interval to periodically send mock closure updates
    if (!mockClosureInterval) {
      mockClosureInterval = setInterval(() => {
        simulateClosureUpdate();
      }, 20000); // Every 20 seconds
    }
    return;
  }
  
  if (isConnected && socket) {
    socket.emit('subscribe:closures', { lat, lng });
    
    // Set up event listener for closure updates
    socket.on('closure:update', (data) => {
      callback(data);
    });
  }
};

/**
 * Unsubscribe from traffic updates
 */
export const unsubscribeFromTrafficUpdates = (callback) => {
  // Remove from active subscriptions
  activeSubscriptions.traffic = activeSubscriptions.traffic.filter(
    sub => sub.callback !== callback
  );
  
  if (useMockData) {
    if (activeSubscriptions.traffic.length === 0 && mockTrafficInterval) {
      clearInterval(mockTrafficInterval);
      mockTrafficInterval = null;
    }
    return;
  }
  
  if (isConnected && socket) {
    socket.emit('unsubscribe:traffic');
    socket.off('traffic:update');
  }
};

/**
 * Unsubscribe from route updates
 */
export const unsubscribeFromRouteUpdates = (callback) => {
  // Remove from active subscriptions
  activeSubscriptions.routes = activeSubscriptions.routes.filter(
    sub => sub.callback !== callback
  );
  
  if (useMockData) {
    if (activeSubscriptions.routes.length === 0 && mockRouteInterval) {
      clearInterval(mockRouteInterval);
      mockRouteInterval = null;
    }
    return;
  }
  
  if (isConnected && socket) {
    socket.emit('unsubscribe:route');
    socket.off('route:update');
  }
};

/**
 * Unsubscribe from closure updates
 */
export const unsubscribeFromClosureUpdates = (callback) => {
  // Remove from active subscriptions
  activeSubscriptions.closures = activeSubscriptions.closures.filter(
    sub => sub.callback !== callback
  );
  
  if (useMockData) {
    if (activeSubscriptions.closures.length === 0 && mockClosureInterval) {
      clearInterval(mockClosureInterval);
      mockClosureInterval = null;
    }
    return;
  }
  
  if (isConnected && socket) {
    socket.emit('unsubscribe:closures');
    socket.off('closure:update');
  }
};

// Private helper functions for mock data

function setupMockSocketEvents() {
  console.log('Setting up mock socket events');
  isConnected = true; // Pretend we're connected
}

function cleanupMockIntervals() {
  if (mockTrafficInterval) {
    clearInterval(mockTrafficInterval);
    mockTrafficInterval = null;
  }
  
  if (mockRouteInterval) {
    clearInterval(mockRouteInterval);
    mockRouteInterval = null;
  }
  
  if (mockClosureInterval) {
    clearInterval(mockClosureInterval);
    mockClosureInterval = null;
  }
}

function simulateTrafficUpdate() {
  // Get random traffic incident from mock data
  const incidents = mockTrafficData.incidents;
  const randomIncident = incidents[Math.floor(Math.random() * incidents.length)];
  
  // Update time to make it look real-time
  const updatedIncident = {
    ...randomIncident,
    timestamp: new Date().toISOString(),
    // Slightly modify values to simulate changes
    speedKmph: randomIncident.speedKmph + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5),
    delayMinutes: randomIncident.delayMinutes + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)
  };
  
  // Send to all subscribers
  activeSubscriptions.traffic.forEach(sub => {
    sub.callback(updatedIncident);
  });
}

function simulateRouteUpdate() {
  // Choose a random route to update
  const routeIndex = Math.floor(Math.random() * mockRoutes.length);
  const route = mockRoutes[routeIndex];
  
  // Create an updated route with slightly different duration/delay
  const updatedRoute = {
    ...route,
    duration: route.duration + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 300), // +/- 5min
    trafficDelay: route.trafficDelay + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 180), // +/- 3min
    timestamp: new Date().toISOString()
  };
  
  // Send to all subscribers
  activeSubscriptions.routes.forEach(sub => {
    sub.callback(updatedRoute);
  });
}

function simulateClosureUpdate() {
  // 30% chance of a new closure
  if (Math.random() < 0.3) {
    // Get a random closure from mock data
    const randomClosureIndex = Math.floor(Math.random() * mockClosures.length);
    const baseClosure = mockClosures[randomClosureIndex];
    
    // Create a new closure with modified position
    const newClosure = {
      ...baseClosure,
      id: `dynamic-closure-${Date.now()}`,
      lat: baseClosure.lat + (Math.random() - 0.5) * 0.05,
      lng: baseClosure.lng + (Math.random() - 0.5) * 0.05,
      reason: `${baseClosure.reason} (New)`,
      startTime: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
    
    // Send to all subscribers
    activeSubscriptions.closures.forEach(sub => {
      sub.callback(newClosure);
    });
  }
}

export default {
  socket,
  connect,
  disconnect,
  subscribeToRouteUpdates,
  subscribeToTrafficUpdates,
  subscribeToClosureUpdates,
  unsubscribeFromRouteUpdates,
  unsubscribeFromTrafficUpdates,
  unsubscribeFromClosureUpdates
}; 