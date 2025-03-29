import { supabase } from '@/integrations/supabase/client';
import {
  UserProfile,
  Vehicle,
  Location,
  RoadSegment,
  TollPlaza,
  TollRate,
  WeatherCondition,
  TrafficCondition,
  FuelPrice,
  Route,
  RouteSegment,
  TravelHistory,
} from '@/integrations/supabase/database.types';

// User Profiles
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...profile, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Vehicles
export const getVehicles = async (): Promise<Vehicle[]> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Locations
export const getLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const searchLocations = async (query: string): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(10);

  if (error) throw error;
  return data;
};

// Find nearest location by coordinates
export const findNearestLocation = async (latitude: number, longitude: number): Promise<Location | null> => {
  // Using a basic approach to find the nearest location using Euclidean distance
  // In a production app, you would use PostGIS with a proper geographic distance calculation
  
  // Get all locations
  const { data, error } = await supabase
    .from('locations')
    .select('*');
    
  if (error) throw error;
  if (!data || data.length === 0) return null;
  
  // Calculate distance for each location
  const locationsWithDistance = data.map(loc => {
    const distance = Math.sqrt(
      Math.pow((loc.latitude - latitude), 2) + 
      Math.pow((loc.longitude - longitude), 2)
    );
    return { ...loc, distance };
  });
  
  // Sort by distance and return the closest one
  locationsWithDistance.sort((a, b) => a.distance - b.distance);
  
  return locationsWithDistance[0];
};

// Function to add a new location
export const addLocation = async (location: Partial<Location>): Promise<Location> => {
  const { data, error } = await supabase
    .from('locations')
    .insert(location)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const getTollPlazas = async (): Promise<TollPlaza[]> => {
  const { data, error } = await supabase
    .from('toll_plazas')
    .select('*, locations(*)');

  if (error) throw error;
  return data;
};

// Toll Rates
export const getTollRates = async (tollPlazaId: string): Promise<TollRate[]> => {
  const { data, error } = await supabase
    .from('toll_rates')
    .select('*')
    .eq('toll_plaza_id', tollPlazaId);

  if (error) throw error;
  return data;
};

// Road Segments
export const getRoadSegments = async (): Promise<RoadSegment[]> => {
  const { data, error } = await supabase
    .from('road_segments')
    .select('*, start_location:locations!road_segments_start_location_id_fkey(*), end_location:locations!road_segments_end_location_id_fkey(*)');

  if (error) throw error;
  return data;
};

// Weather Conditions
export const getLatestWeatherConditions = async (): Promise<WeatherCondition[]> => {
  const { data, error } = await supabase
    .from('weather_conditions')
    .select('*, locations(*)')
    .order('recorded_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

// Traffic Conditions
export const getLatestTrafficConditions = async (): Promise<TrafficCondition[]> => {
  const { data, error } = await supabase
    .from('traffic_conditions')
    .select('*, road_segments(*)')
    .order('recorded_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

// Fuel Prices
export const getLatestFuelPrices = async (): Promise<FuelPrice[]> => {
  const { data, error } = await supabase
    .from('fuel_prices')
    .select('*')
    .order('effective_date', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

// Routes
export const getUserRoutes = async (): Promise<Route[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      origin:locations!routes_origin_id_fkey(*),
      destination:locations!routes_destination_id_fkey(*),
      vehicle:vehicles(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createRoute = async (route: Partial<Route>): Promise<Route> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('routes')
    .insert({ ...route, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Route Segments
export const getRouteSegments = async (routeId: string): Promise<RouteSegment[]> => {
  const { data, error } = await supabase
    .from('route_segments')
    .select('*, road_segments(*)')
    .eq('route_id', routeId)
    .order('sequence_number');

  if (error) throw error;
  return data;
};

// Travel History
export const getUserTravelHistory = async (): Promise<TravelHistory[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('travel_history')
    .select(`
      *,
      route:routes(
        *,
        origin:locations!routes_origin_id_fkey(*),
        destination:locations!routes_destination_id_fkey(*),
        vehicle:vehicles(*)
      )
    `)
    .eq('user_id', user.id)
    .order('actual_start_time', { ascending: false });

  if (error) throw error;
  return data;
};

export const createTravelHistoryEntry = async (entry: Partial<TravelHistory>): Promise<TravelHistory> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('travel_history')
    .insert({ ...entry, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}; 