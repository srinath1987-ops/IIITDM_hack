-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create tables
CREATE TABLE IF NOT EXISTS traffic_data (
  id SERIAL PRIMARY KEY,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  congestion_level INTEGER NOT NULL, -- 0-10 scale
  speed DECIMAL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  location GEOGRAPHY(POINT),
  source VARCHAR(50) DEFAULT 'mapmyindia'
);

CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  start_lat DECIMAL NOT NULL,
  start_lng DECIMAL NOT NULL,
  end_lat DECIMAL NOT NULL,
  end_lng DECIMAL NOT NULL,
  distance DECIMAL NOT NULL, -- in meters
  duration DECIMAL NOT NULL, -- in seconds
  route_geometry TEXT, -- encoded polyline
  traffic_level INTEGER, -- 0-10 scale (average along route)
  route_type VARCHAR(50) DEFAULT 'optimal', -- optimal, fastest, shortest, alternate
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  toll_cost DECIMAL DEFAULT 0,
  vehicle_type VARCHAR(50) DEFAULT 'truck',
  path GEOGRAPHY(LINESTRING)
);

CREATE TABLE IF NOT EXISTS road_closures (
  id SERIAL PRIMARY KEY,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  reason VARCHAR(255),
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  location GEOGRAPHY(POINT),
  source VARCHAR(50) DEFAULT 'openstreetmap'
);

CREATE TABLE IF NOT EXISTS toll_points (
  id SERIAL PRIMARY KEY,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  name VARCHAR(255),
  cost DECIMAL,
  currency VARCHAR(10) DEFAULT 'INR',
  location GEOGRAPHY(POINT),
  route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS traffic_data_loc_idx ON traffic_data USING GIST(location);
CREATE INDEX IF NOT EXISTS routes_path_idx ON routes USING GIST(path);
CREATE INDEX IF NOT EXISTS road_closures_loc_idx ON road_closures USING GIST(location);

-- Create function to automatically update location from lat/lng
CREATE OR REPLACE FUNCTION update_geography_point()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update path from route_geometry
CREATE OR REPLACE FUNCTION update_geography_linestring()
RETURNS TRIGGER AS $$
BEGIN
  -- This assumes route_geometry is a properly formatted GeoJSON LineString or Encoded Polyline
  -- In a real system, you'd need to decode the polyline here
  NEW.path = ST_SetSRID(ST_GeomFromGeoJSON(NEW.route_geometry), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_traffic_point
BEFORE INSERT OR UPDATE ON traffic_data
FOR EACH ROW EXECUTE FUNCTION update_geography_point();

CREATE TRIGGER update_closure_point
BEFORE INSERT OR UPDATE ON road_closures
FOR EACH ROW EXECUTE FUNCTION update_geography_point();

CREATE TRIGGER update_toll_point
BEFORE INSERT OR UPDATE ON toll_points
FOR EACH ROW EXECUTE FUNCTION update_geography_point();

-- This would need to be adjusted based on how route_geometry is stored
-- CREATE TRIGGER update_route_path
-- BEFORE INSERT OR UPDATE ON routes
-- FOR EACH ROW EXECUTE FUNCTION update_geography_linestring(); 