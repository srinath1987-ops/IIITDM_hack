import { supabase } from '@/integrations/supabase/client';

/**
 * Script to update location data and fix the "Unknown" location issue in travel history
 */

// Sample location data with coordinates (replace with actual locations)
const locationData = [
  {
    name: 'Mumbai',
    address: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    postal_code: '400001',
    latitude: 19.0760,
    longitude: 72.8777,
    is_toll_plaza: false
  },
  {
    name: 'Delhi',
    address: 'Delhi, National Capital Territory',
    city: 'Delhi',
    state: 'Delhi',
    postal_code: '110001',
    latitude: 28.6139,
    longitude: 77.2090,
    is_toll_plaza: false
  },
  {
    name: 'Bangalore',
    address: 'Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    postal_code: '560001',
    latitude: 12.9716,
    longitude: 77.5946,
    is_toll_plaza: false
  },
  {
    name: 'Chennai',
    address: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postal_code: '600001',
    latitude: 13.0827,
    longitude: 80.2707,
    is_toll_plaza: false
  },
  {
    name: 'Hyderabad',
    address: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    postal_code: '500001',
    latitude: 17.3850,
    longitude: 78.4867,
    is_toll_plaza: false
  },
  {
    name: 'Kolkata',
    address: 'Kolkata, West Bengal',
    city: 'Kolkata',
    state: 'West Bengal',
    postal_code: '700001',
    latitude: 22.5726,
    longitude: 88.3639,
    is_toll_plaza: false
  },
  {
    name: 'Pune',
    address: 'Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    postal_code: '411001',
    latitude: 18.5204,
    longitude: 73.8567,
    is_toll_plaza: false
  },
  {
    name: 'Ahmedabad',
    address: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postal_code: '380001',
    latitude: 23.0225,
    longitude: 72.5714,
    is_toll_plaza: false
  },
  {
    name: 'Mumbai-Pune Expressway Toll Plaza',
    address: 'Mumbai-Pune Expressway',
    city: 'Khalapur',
    state: 'Maharashtra',
    postal_code: '410203',
    latitude: 18.7867,
    longitude: 73.2334,
    is_toll_plaza: true
  },
  {
    name: 'Kherki Daula Toll Plaza',
    address: 'NH-8, Gurugram',
    city: 'Gurugram',
    state: 'Haryana',
    postal_code: '122001',
    latitude: 28.4523,
    longitude: 76.9812,
    is_toll_plaza: true
  }
];

// Sample vehicle data
const vehicleData = [
  {
    name: 'Small Truck',
    type: 'LCV',
    max_weight: 7.5,
    fuel_efficiency: 10.5,
    axle_count: 2
  },
  {
    name: 'Heavy Truck',
    type: 'HCV',
    max_weight: 25.0,
    fuel_efficiency: 5.2,
    axle_count: 6
  },
  {
    name: 'Container Carrier',
    type: 'HCV',
    max_weight: 30.0,
    fuel_efficiency: 4.8,
    axle_count: 10
  },
  {
    name: 'Mini Van',
    type: 'LCV',
    max_weight: 3.5,
    fuel_efficiency: 12.0,
    axle_count: 2
  }
];

// Function to insert location data
const insertLocations = async () => {
  console.log('Inserting location data...');
  
  for (const location of locationData) {
    const { data: existingLocations } = await supabase
      .from('locations')
      .select('*')
      .eq('name', location.name)
      .limit(1);
    
    if (existingLocations && existingLocations.length > 0) {
      console.log(`Location ${location.name} already exists, skipping...`);
      continue;
    }
    
    const { data, error } = await supabase
      .from('locations')
      .insert(location)
      .select();
    
    if (error) {
      console.error(`Error inserting location ${location.name}:`, error);
    } else {
      console.log(`Inserted location: ${location.name}`);
    }
  }
  
  console.log('Location data insertion complete.');
};

// Function to insert vehicle data
const insertVehicles = async () => {
  console.log('Inserting vehicle data...');
  
  for (const vehicle of vehicleData) {
    const { data: existingVehicles } = await supabase
      .from('vehicles')
      .select('*')
      .eq('name', vehicle.name)
      .limit(1);
    
    if (existingVehicles && existingVehicles.length > 0) {
      console.log(`Vehicle ${vehicle.name} already exists, skipping...`);
      continue;
    }
    
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select();
    
    if (error) {
      console.error(`Error inserting vehicle ${vehicle.name}:`, error);
    } else {
      console.log(`Inserted vehicle: ${vehicle.name}`);
    }
  }
  
  console.log('Vehicle data insertion complete.');
};

// Function to update routes with location and vehicle data
const updateRoutes = async () => {
  console.log('Updating routes with location and vehicle data...');
  
  // Get all locations and vehicles for reference
  const { data: locations } = await supabase.from('locations').select('*');
  const { data: vehicles } = await supabase.from('vehicles').select('*');
  
  if (!locations || !vehicles) {
    console.error('Failed to fetch locations or vehicles');
    return;
  }
  
  // Get routes that need updating (those with null origin or destination)
  const { data: routes } = await supabase
    .from('routes')
    .select('*')
    .or('origin_id.is.null,destination_id.is.null,vehicle_id.is.null');
  
  if (!routes || routes.length === 0) {
    console.log('No routes need updating');
    return;
  }
  
  console.log(`Found ${routes.length} routes that need updating`);
  
  for (const route of routes) {
    // Pick random locations for origin/destination if they're null
    const originLocationIndex = Math.floor(Math.random() * (locations.length - 1));
    let destinationLocationIndex;
    
    // Make sure origin and destination are different
    do {
      destinationLocationIndex = Math.floor(Math.random() * (locations.length - 1));
    } while (destinationLocationIndex === originLocationIndex);
    
    // Pick a random vehicle if it's null
    const vehicleIndex = Math.floor(Math.random() * (vehicles.length - 1));
    
    const updates = {
      ...(route.origin_id === null && { origin_id: locations[originLocationIndex].id }),
      ...(route.destination_id === null && { destination_id: locations[destinationLocationIndex].id }),
      ...(route.vehicle_id === null && { vehicle_id: vehicles[vehicleIndex].id }),
      // Add some realistic values for the route
      total_distance: Math.floor(Math.random() * 1000) + 500, // 500-1500 km
      estimated_time: Math.floor(Math.random() * 500) + 200, // 200-700 minutes
      total_toll_cost: Math.floor(Math.random() * 1000) + 500, // ₹500-1500
      estimated_fuel_cost: Math.floor(Math.random() * 5000) + 2000, // ₹2000-7000
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('routes')
      .update(updates)
      .eq('id', route.id);
    
    if (error) {
      console.error(`Error updating route ${route.id}:`, error);
    } else {
      console.log(`Updated route: ${route.id}`);
    }
  }
  
  console.log('Route updating complete.');
};

// Function to update travel history with actual values
const updateTravelHistory = async () => {
  console.log('Updating travel history with actual values...');
  
  // Get travel history that needs updating (those with null values)
  const { data: history } = await supabase
    .from('travel_history')
    .select('*')
    .or('actual_distance.is.null,actual_fuel_cost.is.null,actual_toll_cost.is.null');
  
  if (!history || history.length === 0) {
    console.log('No travel history needs updating');
    return;
  }
  
  console.log(`Found ${history.length} travel history entries that need updating`);
  
  // Current date
  const now = new Date();
  
  for (const entry of history) {
    // Get associated route to base actual values on estimated values
    const { data: route } = await supabase
      .from('routes')
      .select('*')
      .eq('id', entry.route_id)
      .single();
    
    if (!route) {
      console.error(`Route not found for travel history ${entry.id}`);
      continue;
    }
    
    // Create random actual values based on estimated values (with small variations)
    const variationFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
    
    // Random dates within the last 6 months
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - Math.floor(Math.random() * 6));
    startDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
    
    // End date is start date + estimated time (in minutes) with variation
    const endDate = new Date(startDate);
    const durationInMinutes = route.estimated_time ? route.estimated_time * variationFactor : 240;
    endDate.setMinutes(endDate.getMinutes() + durationInMinutes);
    
    const updates = {
      actual_start_time: startDate.toISOString(),
      actual_end_time: endDate.toISOString(),
      actual_distance: route.total_distance ? route.total_distance * variationFactor : 1000,
      actual_fuel_cost: route.estimated_fuel_cost ? route.estimated_fuel_cost * variationFactor : 3000,
      actual_toll_cost: route.total_toll_cost ? route.total_toll_cost * variationFactor : 1000,
      rating: Math.floor(Math.random() * 3) + 3, // Random rating from 3-5
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('travel_history')
      .update(updates)
      .eq('id', entry.id);
    
    if (error) {
      console.error(`Error updating travel history ${entry.id}:`, error);
    } else {
      console.log(`Updated travel history: ${entry.id}`);
    }
  }
  
  console.log('Travel history updating complete.');
};

// Create sample travel history entries if none exist
const createSampleTravelHistory = async () => {
  console.log('Checking if sample travel history needs to be created...');
  
  // Check if any travel history exists
  const { data: existingHistory, count } = await supabase
    .from('travel_history')
    .select('*', { count: 'exact' });
  
  if (count && count > 0) {
    console.log(`${count} travel history entries already exist, skipping creation of samples`);
    return;
  }
  
  console.log('No travel history found, creating sample entries...');
  
  // Get user profiles
  const { data: users } = await supabase.from('user_profiles').select('id');
  
  if (!users || users.length === 0) {
    console.error('No users found');
    return;
  }
  
  // Get routes
  const { data: routes } = await supabase.from('routes').select('*');
  
  if (!routes || routes.length === 0) {
    console.log('No routes found, creating some first...');
    await createSampleRoutes(users[0].id);
    
    // Fetch routes again
    const { data: newRoutes } = await supabase.from('routes').select('*');
    if (!newRoutes || newRoutes.length === 0) {
      console.error('Failed to create routes');
      return;
    }
    
    // Continue with the newly created routes
    for (const route of newRoutes.slice(0, 5)) {
      await createTravelHistoryForRoute(users[0].id, route.id);
    }
  } else {
    // Create history for existing routes
    for (const route of routes.slice(0, 5)) {
      await createTravelHistoryForRoute(users[0].id, route.id);
    }
  }
  
  console.log('Sample travel history creation complete.');
};

// Helper function to create a sample route
const createSampleRoutes = async (userId: string) => {
  // Get locations and vehicles
  const { data: locations } = await supabase.from('locations').select('*');
  const { data: vehicles } = await supabase.from('vehicles').select('*');
  
  if (!locations || locations.length < 2 || !vehicles || vehicles.length === 0) {
    console.error('Not enough locations or vehicles to create routes');
    return;
  }
  
  // Create 5 sample routes
  for (let i = 0; i < 5; i++) {
    // Pick random locations for origin/destination
    const originIndex = Math.floor(Math.random() * (locations.length - 1));
    let destIndex;
    
    // Make sure origin and destination are different
    do {
      destIndex = Math.floor(Math.random() * (locations.length - 1));
    } while (destIndex === originIndex);
    
    // Pick a random vehicle
    const vehicleIndex = Math.floor(Math.random() * (vehicles.length - 1));
    
    const route = {
      user_id: userId,
      origin_id: locations[originIndex].id,
      destination_id: locations[destIndex].id,
      vehicle_id: vehicles[vehicleIndex].id,
      cargo_weight: Math.floor(Math.random() * 20) + 5, // 5-25 tons
      cargo_type: ['construction', 'food', 'machinery', 'chemicals', 'electronics'][Math.floor(Math.random() * 5)],
      total_distance: Math.floor(Math.random() * 1000) + 500, // 500-1500 km
      estimated_time: Math.floor(Math.random() * 500) + 200, // 200-700 minutes
      total_toll_cost: Math.floor(Math.random() * 1000) + 500, // ₹500-1500
      estimated_fuel_cost: Math.floor(Math.random() * 5000) + 2000, // ₹2000-7000
      route_geometry: { points: "mock-geometry-data" },
      waypoints: [{ name: 'Waypoint 1' }, { name: 'Waypoint 2' }],
    };
    
    const { error } = await supabase.from('routes').insert(route);
    
    if (error) {
      console.error(`Error creating sample route:`, error);
    } else {
      console.log(`Created sample route from ${locations[originIndex].name} to ${locations[destIndex].name}`);
    }
  }
};

// Helper function to create travel history for a route
const createTravelHistoryForRoute = async (userId: string, routeId: string) => {
  // Get route details
  const { data: route } = await supabase
    .from('routes')
    .select('*')
    .eq('id', routeId)
    .single();
  
  if (!route) {
    console.error(`Route ${routeId} not found`);
    return;
  }
  
  // Create random actual values based on estimated values (with small variations)
  const variationFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
  
  // Random dates within the last 6 months
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - Math.floor(Math.random() * 6));
  startDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
  
  // End date is start date + estimated time (in minutes) with variation
  const endDate = new Date(startDate);
  const durationInMinutes = route.estimated_time ? route.estimated_time * variationFactor : 240;
  endDate.setMinutes(endDate.getMinutes() + durationInMinutes);
  
  const travelHistory = {
    user_id: userId,
    route_id: routeId,
    actual_start_time: startDate.toISOString(),
    actual_end_time: endDate.toISOString(),
    actual_distance: route.total_distance ? route.total_distance * variationFactor : 1000,
    actual_fuel_cost: route.estimated_fuel_cost ? route.estimated_fuel_cost * variationFactor : 3000,
    actual_toll_cost: route.total_toll_cost ? route.total_toll_cost * variationFactor : 1000,
    notes: Math.random() > 0.5 ? 'Road conditions were good. Delivery completed on time.' : null,
    rating: Math.floor(Math.random() * 3) + 3, // Random rating from 3-5
  };
  
  const { error } = await supabase.from('travel_history').insert(travelHistory);
  
  if (error) {
    console.error(`Error creating travel history for route ${routeId}:`, error);
  } else {
    console.log(`Created travel history for route ${routeId}`);
  }
};

// Main function to run the update script
const runUpdateScript = async () => {
  try {
    console.log('Starting database update script...');
    
    // Step 1: Insert location data
    await insertLocations();
    
    // Step 2: Insert vehicle data
    await insertVehicles();
    
    // Step 3: Update routes with location and vehicle data
    await updateRoutes();
    
    // Step 4: Create sample travel history if needed
    await createSampleTravelHistory();
    
    // Step 5: Update travel history with actual values
    await updateTravelHistory();
    
    console.log('Database update script completed successfully.');
  } catch (error) {
    console.error('Error running update script:', error);
  }
};

// Export the function to run from a terminal or script
export { runUpdateScript };

// If running directly (not imported)
if (typeof require !== 'undefined' && require.main === module) {
  runUpdateScript()
    .then(() => console.log('Script execution completed'))
    .catch(err => console.error('Script execution failed:', err));
} 