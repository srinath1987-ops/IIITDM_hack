export interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  max_weight: number;
  max_volume: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  axle_count: number | null;
  fuel_efficiency: number | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  is_toll_plaza: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoadSegment {
  id: string;
  name: string | null;
  start_location_id: string;
  end_location_id: string;
  distance: number;
  road_type: string | null;
  road_quality: string | null;
  width: number | null;
  weight_limit: number | null;
  height_limit: number | null;
  speed_limit: number | null;
  has_restrictions: boolean;
  restriction_details: any | null;
  created_at: string;
  updated_at: string;
}

export interface TollPlaza {
  id: string;
  location_id: string;
  name: string;
  highway_name: string | null;
  is_fastag_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface TollRate {
  id: string;
  toll_plaza_id: string;
  vehicle_type: string;
  rate: number;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeatherCondition {
  id: string;
  location_id: string;
  condition: string | null;
  temperature: number | null;
  precipitation: number | null;
  visibility: number | null;
  wind_speed: number | null;
  recorded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrafficCondition {
  id: string;
  road_segment_id: string;
  congestion_level: string | null;
  speed_factor: number | null;
  delay_minutes: number | null;
  recorded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FuelPrice {
  id: string;
  state: string;
  city: string | null;
  diesel_price: number;
  petrol_price: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  user_id: string;
  origin_id: string;
  destination_id: string;
  vehicle_id: string;
  cargo_weight: number | null;
  cargo_type: string | null;
  total_distance: number | null;
  estimated_time: number | null;
  total_toll_cost: number | null;
  estimated_fuel_cost: number | null;
  route_geometry: any | null;
  waypoints: any | null;
  created_at: string;
  updated_at: string;
}

export interface RouteSegment {
  id: string;
  route_id: string;
  road_segment_id: string;
  sequence_number: number | null;
  distance: number | null;
  estimated_time: number | null;
  toll_cost: number | null;
  created_at: string;
  updated_at: string;
}

export interface TravelHistory {
  id: string;
  user_id: string;
  route_id: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  actual_distance: number | null;
  actual_fuel_cost: number | null;
  actual_toll_cost: number | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

// Extended Database interface with our tables
export interface Database {
  user_profiles: UserProfile;
  vehicles: Vehicle;
  locations: Location;
  road_segments: RoadSegment;
  toll_plazas: TollPlaza;
  toll_rates: TollRate;
  weather_conditions: WeatherCondition;
  traffic_conditions: TrafficCondition;
  fuel_prices: FuelPrice;
  routes: Route;
  route_segments: RouteSegment;
  travel_history: TravelHistory;
} 