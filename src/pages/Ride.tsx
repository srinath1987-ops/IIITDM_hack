
import React, { useState, useCallback } from 'react';
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
  Cloud,
  Loader2
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';


interface Toll {
  name: string;
  cost: number;
}
interface Route {
  id: number;
  name: string;
  isRecommended: boolean;
  distance: number;
  duration: number;
  tollCost: number;
  fuelCost: number;
  tolls: Toll[];
  timeSaved: number;
  weather: string;
}

// Mock route options based on route type
const routeOptions: Record<string, Route[]> = {
  default: [
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
  ],
  'lorry': [
    {
      id: 1,
      name: 'Route 1 (Recommended)',
      isRecommended: true,
      distance: 318,
      duration: 5.2,
      tollCost: 720,
      fuelCost: 1900,
      tolls: [
        { name: 'Chennai Bypass Toll Plaza', cost: 220 },
        { name: 'Paranur Toll Plaza', cost: 200 },
        { name: 'Vikravandi Toll Gate', cost: 300 }
      ],
      timeSaved: 1.8,
      weather: 'Clear',
    },
    {
      id: 2,
      name: 'Route 2',
      isRecommended: false,
      distance: 335,
      duration: 6.2,
      tollCost: 580,
      fuelCost: 2100,
      tolls: [
        { name: 'Chennai Peripheral Toll', cost: 180 },
        { name: 'Tindivanam Toll Gate', cost: 400 }
      ],
      timeSaved: 0.8,
      weather: 'Cloudy',
    },
  ],
  'truck': [
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
  ],
  '10wheeler': [
    {
      id: 1,
      name: 'Route 1 (Recommended)',
      isRecommended: true,
      distance: 358,
      duration: 6.2,
      tollCost: 980,
      fuelCost: 2800,
      tolls: [
        { name: 'Chennai Eastern Ring Road', cost: 300 },
        { name: 'Chengalpattu Plaza', cost: 280 },
        { name: 'Trichy Highway Toll', cost: 400 }
      ],
      timeSaved: 1.5,
      weather: 'Clear',
    },
    {
      id: 2,
      name: 'Route 2',
      isRecommended: false,
      distance: 372,
      duration: 7.1,
      tollCost: 850,
      fuelCost: 3000,
      tolls: [
        { name: 'Chennai Bypass Toll Plaza', cost: 350 },
        { name: 'Ulundurpet Toll Gate', cost: 500 }
      ],
      timeSaved: 0.6,
      weather: 'Cloudy',
    },
  ],
  '14wheeler': [
    {
      id: 1,
      name: 'Route 1 (Recommended)',
      isRecommended: true,
      distance: 382,
      duration: 7.5,
      tollCost: 1200,
      fuelCost: 3500,
      tolls: [
        { name: 'Chennai Heavy Vehicle Corridor', cost: 400 },
        { name: 'Kanchipuram Truck Plaza', cost: 350 },
        { name: 'Madurai North Gate', cost: 450 }
      ],
      timeSaved: 2.3,
      weather: 'Clear',
    },
    {
      id: 2,
      name: 'Route 2',
      isRecommended: false,
      distance: 410,
      duration: 9.2,
      tollCost: 980,
      fuelCost: 3800,
      tolls: [
        { name: 'Chennai Outer Ring Road', cost: 380 },
        { name: 'Salem Heavy Vehicle Plaza', cost: 600 }
      ],
      timeSaved: 0.5,
      weather: 'Rain',
    },
  ],
};

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

// Popular routes
const popularRoutes = [
  { from: 'Chennai, Tamil Nadu', to: 'Madurai, Tamil Nadu' },
  { from: 'Mumbai, Maharashtra', to: 'Pune, Maharashtra' },
  { from: 'Delhi, NCR', to: 'Jaipur, Rajasthan' },
  { from: 'Bangalore, Karnataka', to: 'Hyderabad, Telangana' },
];

const Ride = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [startLocation, setStartLocation] = useState('Chennai, Tamil Nadu');
  const [destination, setDestination] = useState('Madurai, Tamil Nadu');
  const [vehicleType, setVehicleType] = useState('truck');
  const [goodsType, setGoodsType] = useState('construction');
  const [weight, setWeight] = useState('15');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [routes, setRoutes] = useState<Route[]>(routeOptions.default);
  const [selectedRoute, setSelectedRoute] = useState<Route>(routeOptions.default[0]);
  const [showRoutes, setShowRoutes] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFindRoutes = () => {
    setLoading(true);
    toast({
      title: "Finding optimal routes",
      description: "Analyzing traffic, tolls, and weather conditions...",
    });
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Get routes based on vehicle type
      const vehicleRoutes = routeOptions[vehicleType as keyof typeof routeOptions] || routeOptions.default;
      setRoutes(vehicleRoutes);
      setSelectedRoute(vehicleRoutes[0]);
      setShowRoutes(true);
      setLoading(false);
      
      toast({
        title: "Routes found",
        description: `Found ${vehicleRoutes.length} routes for your journey`,
      });
    }, 1500);
  };

  const handleSelectRoute = (route: Route) => {
    setSelectedRoute(route);
    
    toast({
      title: "Route Selected",
      description: `You've selected ${route.name}`,
      duration: 2000,
    });
  };

  const handleSelectPopularRoute = (from: string, to: string) => {
    setStartLocation(from);
    setDestination(to);
    
    toast({
      title: "Popular route selected",
      description: `${from} to ${to}`,
      duration: 2000,
    });
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

                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Popular routes:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularRoutes.map((route, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectPopularRoute(route.from, route.to)}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                      >
                        {route.from.split(',')[0]} → {route.to.split(',')[0]}
                      </button>
                    ))}
                  </div>
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
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Routes...
                    </>
                  ) : (
                    'Find Optimal Routes'
                  )}
                </Button>
              </CardContent>
            </Card>
            
            {showRoutes && (
              <Card className={isMobile ? "" : "sticky top-20"}>
                <CardHeader>
                  <CardTitle className="text-lg">Route Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {routes.map((route) => (
                    <div 
                      key={route.id}
                      onClick={() => handleSelectRoute(route)}
                      className={`route-card cursor-pointer p-3 border rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        selectedRoute.id === route.id ? 'ring-2 ring-primary border-transparent' : ''
                      } ${route.isRecommended ? 'bg-logistics-50 dark:bg-logistics-900/20' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium flex items-center">
                          {route.name}
                          {route.isRecommended && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-logistics-100 dark:bg-logistics-900/50 px-2 py-0.5 text-xs font-medium text-logistics-800 dark:text-logistics-300">
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
                        <div className="mt-2 text-xs font-medium text-logistics-700 dark:text-logistics-400">
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
                      {startLocation.split(',')[0]} → {destination.split(',')[0]} ({selectedRoute.distance} km)
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <Map 
                  start={startLocation}
                  destination={destination}
                  selectedRoute={selectedRoute}
                  vehicleType={vehicleType}
                  goodsType={goodsType}
                  weight={weight}
                />
                
                {selectedRoute && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                    <div className="text-sm font-medium mb-2">Toll Information</div>
                    <div className="space-y-2">
                      {selectedRoute.tolls.map((toll: Toll, index: number) => (
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
