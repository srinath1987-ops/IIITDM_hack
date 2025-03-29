
import React, { useState } from 'react';
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

// Mock route options
const routeOptions = [
  {
    id: 1,
    name: 'Route 1 (Recommended)',
    isRecommended: true,
    distance: 325,
    duration: 5.5,
    tollCost: 750,
    fuelCost: 2100,
    tolls: [
      { name: 'Chennai Bypass Toll Plaza', cost: 245 },
      { name: 'Paranur Toll Plaza', cost: 205 },
      { name: 'Vikravandi Toll Gate', cost: 300 }
    ],
    timeSaved: 2.1,
    weather: 'Clear',
  },
  {
    id: 2,
    name: 'Route 2',
    isRecommended: false,
    distance: 342,
    duration: 6.8,
    tollCost: 620,
    fuelCost: 2340,
    tolls: [
      { name: 'Chennai Peripheral Toll', cost: 220 },
      { name: 'Tindivanam Toll Gate', cost: 400 }
    ],
    timeSaved: 0.8,
    weather: 'Rain',
  },
  {
    id: 3,
    name: 'Route 3',
    isRecommended: false,
    distance: 358,
    duration: 7.6,
    tollCost: 540,
    fuelCost: 2450,
    tolls: [
      { name: 'Chennai East Coast Toll', cost: 180 },
      { name: 'Mamallapuram Toll Gate', cost: 160 },
      { name: 'Pondicherry North Toll', cost: 200 }
    ],
    timeSaved: 0,
    weather: 'Cloudy',
  }
];

const vehicleTypes = [
  { value: 'lorry', label: 'Lorry (< 3.5 Tons)' },
  { value: 'truck', label: 'Truck (3.5 - 12 Tons)' },
  { value: '10wheeler', label: '10-Wheeler (12 - 25 Tons)' },
  { value: '14wheeler', label: '14-Wheeler (> 25 Tons)' }
];

const goodsTypes = [
  { value: 'construction', label: 'Construction Materials' },
  { value: 'food', label: 'Food & Perishables' },
  { value: 'machinery', label: 'Machinery & Equipment' },
  { value: 'others', label: 'Others' }
];

const Ride = () => {
  const { toast } = useToast();
  const [startLocation, setStartLocation] = useState('Chennai, Tamil Nadu');
  const [destination, setDestination] = useState('Madurai, Tamil Nadu');
  const [vehicleType, setVehicleType] = useState('truck');
  const [goodsType, setGoodsType] = useState('construction');
  const [weight, setWeight] = useState('15');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(routeOptions[0]);
  const [showRoutes, setShowRoutes] = useState(true);

  const handleFindRoutes = () => {
    toast({
      title: "Finding optimal routes",
      description: "Analyzing traffic, tolls, and weather conditions...",
      duration: 2000,
    });
    
    // In a real app, this would fetch routes from the API
    // For now, we'll just use our mock data and show it
    setShowRoutes(true);
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    
    toast({
      title: "Route Selected",
      description: `You've selected ${route.name}`,
      duration: 2000,
    });
  };

  const getWeatherIcon = (weather) => {
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
                  <Input 
                    id="start" 
                    placeholder="Enter start location" 
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input 
                    id="destination" 
                    placeholder="Enter destination" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
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
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
                  <Label htmlFor="weight">Weight (tons)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    placeholder="Enter weight in tons"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additional-info">Additional Information</Label>
                  <Input 
                    id="additional-info" 
                    placeholder="Any specific requirements"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleFindRoutes}
                >
                  Find Optimal Routes
                </Button>
              </CardContent>
            </Card>
            
            {showRoutes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Route Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {routeOptions.map((route) => (
                    <div 
                      key={route.id}
                      onClick={() => handleSelectRoute(route)}
                      className={`route-card cursor-pointer ${
                        selectedRoute.id === route.id ? 'ring-2 ring-primary' : ''
                      } ${route.isRecommended ? 'recommended' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium flex items-center">
                          {route.name}
                          {route.isRecommended && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-cargo-100 px-2 py-0.5 text-xs font-medium text-cargo-800">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Best
                            </span>
                          )}
                        </div>
                        {getWeatherIcon(route.weather)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <MapIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{route.distance} km</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{route.duration} hours</span>
                        </div>
                        <div className="flex items-center">
                          <Banknote className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>₹{route.tollCost} toll</span>
                        </div>
                        <div className="flex items-center">
                          <Fuel className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>₹{route.fuelCost} fuel</span>
                        </div>
                      </div>
                      
                      {route.timeSaved > 0 && (
                        <div className="mt-2 text-xs font-medium text-cargo-700">
                          Save {route.timeSaved} hours compared to longest route
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card className="h-[calc(100vh-170px)]">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Route Map</CardTitle>
                  {selectedRoute && (
                    <div className="text-sm font-medium">
                      {startLocation} → {destination} ({selectedRoute.distance} km)
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <Map 
                  start={startLocation}
                  destination={destination}
                  selectedRoute={selectedRoute}
                />
                
                {selectedRoute && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                    <div className="text-sm font-medium mb-2">Toll Information</div>
                    <div className="space-y-2">
                      {selectedRoute.tolls.map((toll, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{toll.name}</span>
                          <span className="font-medium">₹{toll.cost}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t flex justify-between text-sm font-medium">
                        <span>Total Toll</span>
                        <span>₹{selectedRoute.tollCost}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Ride;
