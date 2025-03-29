// Mock locations data for the application
export const mockLocations = [
  { id: '1', name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, state: 'Maharashtra' },
  { id: '2', name: 'Delhi', latitude: 28.7041, longitude: 77.1025, state: 'Delhi' },
  { id: '3', name: 'Bangalore', latitude: 12.9716, longitude: 77.5946, state: 'Karnataka' },
  { id: '4', name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, state: 'Telangana' },
  { id: '5', name: 'Chennai', latitude: 13.0827, longitude: 80.2707, state: 'Tamil Nadu' },
  { id: '6', name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, state: 'West Bengal' },
  { id: '7', name: 'Pune', latitude: 18.5204, longitude: 73.8567, state: 'Maharashtra' },
  { id: '8', name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, state: 'Gujarat' },
];

// Mock vehicles data
export const mockVehicles = [
  { id: '1', name: 'Small Truck', type: 'truck', max_weight: 5, fuel_efficiency: 10 },
  { id: '2', name: 'Medium Truck', type: 'truck', max_weight: 10, fuel_efficiency: 8 },
  { id: '3', name: 'Large Truck', type: 'truck', max_weight: 20, fuel_efficiency: 6 },
  { id: '4', name: '10-Wheeler', type: '10-wheeler', max_weight: 25, fuel_efficiency: 5 },
  { id: '5', name: '14-Wheeler', type: '14-wheeler', max_weight: 30, fuel_efficiency: 4 },
];

// Mock goods types
export const goodsTypes = [
  { value: 'general', label: 'General Cargo' },
  { value: 'perishable', label: 'Perishable Goods' },
  { value: 'fragile', label: 'Fragile Items' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'hazardous', label: 'Hazardous Materials' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'livestock', label: 'Livestock' },
]; 