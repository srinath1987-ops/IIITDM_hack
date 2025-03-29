import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';
import Map from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Map as MapIcon, 
  Route, 
  Clock, 
  Banknote, 
  Fuel,
  ThumbsUp,
  CloudRain,
  Sun,
  Cloud
} from 'lucide-react';
import { getVehicles, getLocations, createRoute } from '@/services/supabaseService';
import { Vehicle, Location } from '@/integrations/supabase/database.types';

// Mock route options until we have a real routing API
const generateRouteOptions = (start: string, end: string, vehicleType: string, weight: string) => {
  // In a real app, this would call a routing API with the actual locations
  return [
    {
      id: 1,
      name: 'Route 1 (Recommended)',
      isRecommended: true,
      distance: Math.floor(Math.random() * 100) + 250,
      duration: Math.floor(Math.random() * 20 + 40) / 10,
      tollCost: Math.floor(Math.random() * 300) + 500,
      fuelCost: Math.floor(Math.random() * 500) + 1800,
      tolls: [
        { name: 'Bypass Toll Plaza', cost: Math.floor(Math.random() * 100) + 200 },
        { name: 'Highway Toll Gate', cost: Math.floor(Math.random() * 100) + 150 },
        { name: 'City Toll Gate', cost: Math.floor(Math.random() * 100) + 100 }
      ],
      timeSaved: Math.floor(Math.random() * 15 + 10) / 10,
      weather: 'Clear',
    },
    {
      id: 2,
      name: 'Route 2',
      isRecommended: false,
      distance: Math.floor(Math.random() * 100) + 300,
      duration: Math.floor(Math.random() * 20 + 50) / 10,
      tollCost: Math.floor(Math.random() * 200) + 400,
      fuelCost: Math.floor(Math.random() * 500) + 2000,
      tolls: [
        { name: 'Highway Toll', cost: Math.floor(Math.random() * 100) + 150 },
        { name: 'Bridge Toll', cost: Math.floor(Math.random() * 100) + 200 }
      ],
      timeSaved: Math.floor(Math.random() * 10) / 10,
      weather: 'Rain',
    },
    {
      id: 3,
      name: 'Route 3',
      isRecommended: false,
      distance: Math.floor(Math.random() * 100) + 320,
      duration: Math.floor(Math.random() * 20 + 60) / 10,
      tollCost: Math.floor(Math.random() * 200) + 300,
      fuelCost: Math.floor(Math.random() * 500) + 2200,
      tolls: [
        { name: 'East Toll', cost: Math.floor(Math.random() * 100) + 100 },
        { name: 'North Toll', cost: Math.floor(Math.random() * 100) + 100 },
        { name: 'South Toll', cost: Math.floor(Math.random() * 100) + 100 }
      ],
      timeSaved: 0,
      weather: 'Cloudy',
    }
  ];
};

const goodsTypes = [
  { value: 'construction', label: 'Construction Materials' },
  { value: 'food', label: 'Food & Perishables' },
  { value: 'machinery', label: 'Machinery & Equipment' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'others', label: 'Others' }
];

const Ride = () => {
  const { toast } = useToast();
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [goodsType, setGoodsType] = useState('construction');
  const [weight, setWeight] = useState('15');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [routeOptions, setRouteOptions] = useState<any[]>([]);
  const [startLocationsList, setStartLocationsList] = useState<Location[]>([]);
  const [destinationsList, setDestinationsList] = useState<Location[]>([]);
  
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });
  
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });
  
  useEffect(() => {
    if (locations.length > 0) {
      // For the demo, we'll just show all locations as options
      setStartLocationsList(locations);
      setDestinationsList(locations);
    }
  }, [locations]);
  
  const handleFindRoutes = () => {
    if (!startLocation || !destination || !vehicleType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Finding optimal routes",
      description: "Analyzing traffic, tolls, and weather conditions...",
      duration: 2000,
    });
    
    // In a real app, this would fetch routes from an API
    // For now, we'll generate some mock data
    const generatedRoutes = generateRouteOptions(startLocation, destination, vehicleType, weight);
    setRouteOptions(generatedRoutes);
    setSelectedRoute(generatedRoutes[0]);
    setShowRoutes(true);
  };

  const handleSelectRoute = (route: any) => {
    setSelectedRoute(route);
    
    toast({
      title: "Route Selected",
      description: `You've selected ${route.name}`,
      duration:.2000,
    });
  };

  const handleBookRoute = async () => {
    if (!selectedRoute) return;
    
    try {
      // Get location and vehicle IDs
      const startLocationObj = locations.find(loc => loc.name === startLocation);
      const destinationObj = locations.find(loc => loc.name === destination);
      const vehicleObj = vehicles.find(v => v.id === vehicleType);
      
      if (!startLocationObj || !destinationObj || !vehicleObj) {
        toast({
          title: "Data error",
          description: "Could not find location or vehicle data",
          variant: "destructive",
        });
        return;
      }
      
      // In a real app, we would send this to the backend
      const newRoute = {
        origin_id: startLocationObj.id,
        destination_id: destinationObj.id,
        vehicle_id: vehicleObj.id,
        cargo_weight: parseFloat(weight) || null,
        cargo_type: goodsType,
        total_distance: selectedRoute.distance,
        estimated_time: selectedRoute.duration * 60, // convert to minutes
        total_toll_cost: selectedRoute.tollCost,
        estimated_fuel_cost: selectedRoute.fuelCost,
        route_geometry: { points: "mock-geometry-data" }, // this would come from a mapping API
        waypoints: selectedRoute.tolls.map((toll: any) => ({ name: toll.name })),
      };
      
      await createRoute(newRoute);
      
      toast({
        title: "Route booked successfully!",
        description: "Your journey has been scheduled",
      });
      
      // Reset the form or redirect as needed
    } catch (error) {
      console.error("Error booking route:", error);
      toast({
        title: "Error booking route",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'Clear':
        return <Sun className="h-5 w-5 text-amber-500" />;
      case 'Rain':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="pt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Plan Your Route</h1>
          <p className="text-muted-foreground">
            Find the most efficient route for your cargo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Journey Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Location</Label>
                  <Select 
                    value={startLocation}
                    onValueChange={setStartLocation}
                  >
                    <SelectTrigger id="start">
                      <SelectValue placeholder="Select start location" />
                    </SelectTrigger>
                    <SelectContent>
                      {startLocationsList.map((loc) => (
                        <SelectItem key={loc.id} value={loc.name}>
                          {loc.name}, {loc.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Select 
                    value={destination}
                    onValueChange={setDestination}
                  >
                    <SelectTrigger id="destination">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinationsList.map((loc) => (
                        <SelectItem key={loc.id} value={loc.name}>
                          {loc.name}, {loc.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Vehicle Type</Label>
                  <Select 
                    value={vehicleType}
                    onValueChange={setVehicleType}
                  >
                    <SelectTrigger id="vehicle-type">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goods-type">Goods Type</Label>
                  <Select 
                    value={goodsType}
                    onValueChange={setGoodsType}
                  >
                    <SelectTrigger id="goods-type">
                      <SelectValue placeholder="Select goods type" />
                    </SelectTrigger>
                    <SelectContent>
                      {goodsTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Cargo Weight (tons)</Label>
                  <Input 
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight in tons"
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleFindRoutes}
                  disabled={!startLocation || !destination || !vehicleType}
                >
                  Find Routes
                </Button>
              </CardContent>
            </Card>
            
            {additionalInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{additionalInfo}</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-1 sm:p-2 md:p-4 h-[300px] md:h-[400px]">
                <Map />
              </CardContent>
            </Card>
            
            {showRoutes && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Route Options</h2>
                <div className="grid gap-4">
                  {routeOptions.map((route) => (
                    <Card 
                      key={route.id}
                      className={`cursor-pointer border-2 transition-colors ${
                        selectedRoute && selectedRoute.id === route.id 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleSelectRoute(route)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-lg flex items-center">
                              {route.name}
                              {route.isRecommended && (
                                <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Recommended
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center text-muted-foreground mt-1">
                              <MapIcon className="h-4 w-4 mr-1" />
                              <span className="text-sm">{route.distance} km</span>
                              <span className="mx-2">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">{route.duration} hrs</span>
                              <span className="mx-2">•</span>
                              {getWeatherIcon(route.weather)}
                              <span className="text-sm ml-1">{route.weather}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold">₹{(route.tollCost + route.fuelCost).toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Total Cost</div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Toll Cost</div>
                            <div className="font-medium">₹{route.tollCost.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground mt-1">{route.tolls.length} toll plazas</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Fuel Cost</div>
                            <div className="font-medium">₹{route.fuelCost.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground mt-1">Based on current rates</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Time Saved</div>
                            <div className="font-medium">{route.timeSaved} hrs</div>
                            <div className="text-xs text-muted-foreground mt-1">Compared to longest route</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {selectedRoute && (
                  <Button onClick={handleBookRoute} size="lg" className="w-full">
                    Book This Route
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Ride;
