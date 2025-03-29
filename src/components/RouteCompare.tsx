import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Check, Clock, Ban, CloudRain, AlertTriangle, Banknote, ShieldCheck, Truck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Map from '@/components/Map';
import { RouteOptimizationResponse } from '@/integrations/ai/routeOptimizationService';

interface RouteCompareProps {
  routes: RouteOptimizationResponse[];
  onSelectRoute: (routeId: string) => void;
}

const RouteCompare: React.FC<RouteCompareProps> = ({ routes, onSelectRoute }) => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(
    routes.length > 0 ? routes[0].id : null
  );
  const [activeTab, setActiveTab] = useState('overview');
  
  // Function to get the selected route data
  const getSelectedRouteData = () => {
    return routes.find(route => route.id === selectedRoute) || routes[0];
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Function to get weather icon
  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'Rain':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      case 'Fog':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  // Get road conditions icon
  const getRoadConditionsIcon = (conditions: string) => {
    switch (conditions) {
      case 'poor':
        return <Ban className="h-4 w-4 text-red-500" />;
      case 'average':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'good':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  // Select a route
  const handleSelectRoute = (routeId: string) => {
    setSelectedRoute(routeId);
  };
  
  // Confirm route selection
  const handleConfirmRoute = () => {
    if (selectedRoute) {
      onSelectRoute(selectedRoute);
    }
  };
  
  // Get route's time and cost comparison
  const getRouteComparison = (route: RouteOptimizationResponse) => {
    const timeComparison = route.isRecommended ? `Save ${route.timeSaved} hours` : '';
    
    // Find the cheapest route
    const cheapestRoute = [...routes].sort((a, b) => a.totalCost - b.totalCost)[0];
    
    let costDiff = 0;
    if (cheapestRoute && cheapestRoute.id !== route.id) {
      costDiff = route.totalCost - cheapestRoute.totalCost;
    }
    
    const costComparison = costDiff > 0 ? `${formatCurrency(costDiff)} more` : '';
    
    return { timeComparison, costComparison };
  };
  
  if (routes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>No routes available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const selectedRouteData = getSelectedRouteData();
  const { timeComparison, costComparison } = getRouteComparison(selectedRouteData);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Route Comparison</CardTitle>
          <CardDescription>Compare different route options based on time, cost, and conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map((route) => (
              <Card 
                key={route.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedRoute === route.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelectRoute(route.id)}
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{route.name}</CardTitle>
                      <CardDescription>
                        {route.distance} km • {route.duration} hours
                      </CardDescription>
                    </div>
                    {route.isRecommended && (
                      <Badge variant="default" className="bg-green-600">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Cost</span>
                      <span className="font-medium">{formatCurrency(route.totalCost)}</span>
                      {costComparison && <span className="text-xs text-red-500">{costComparison}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-medium">{route.duration} hours</span>
                      {timeComparison && <span className="text-xs text-green-500">{timeComparison}</span>}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {getWeatherIcon(route.weather)}
                      {getRoadConditionsIcon(route.roadConditions)}
                      {route.restrictions.length > 0 && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex space-x-1 text-sm">
                      <div className="flex items-center">
                        <ShieldCheck className="mr-1 h-4 w-4 text-blue-500" />
                        <span>{route.safetyScore}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-lg">Route Information</h3>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Distance</p>
                              <p className="font-medium">{selectedRouteData.distance} km</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Duration</p>
                              <p className="font-medium">{selectedRouteData.duration} hours</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Cost</p>
                              <p className="font-medium">{formatCurrency(selectedRouteData.totalCost)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Fuel</p>
                              <p className="font-medium">{selectedRouteData.fuelConsumption} liters</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-lg">Conditions</h3>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Weather</span>
                              <div className="flex items-center">
                                {getWeatherIcon(selectedRouteData.weather)}
                                <span className="ml-1">{selectedRouteData.weather}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Road Conditions</span>
                              <div className="flex items-center">
                                {getRoadConditionsIcon(selectedRouteData.roadConditions)}
                                <span className="capitalize ml-1">{selectedRouteData.roadConditions}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Traffic</span>
                              <span className="capitalize">{selectedRouteData.trafficConditions}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h3 className="font-medium text-lg mb-2">Route Details</h3>
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Segment</TableHead>
                                <TableHead>Distance</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Conditions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedRouteData.segments.map((segment, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div className="font-medium">{segment.startLocation.name}</div>
                                    <div className="text-sm text-muted-foreground">to {segment.endLocation.name}</div>
                                  </TableCell>
                                  <TableCell>{segment.distance} km</TableCell>
                                  <TableCell>{Math.round(segment.duration / 60 * 10) / 10} hr</TableCell>
                                  <TableCell>
                                    <div className="flex space-x-1">
                                      {segment.weather && segment.weather.condition !== 'Clear' && getWeatherIcon(segment.weather.condition)}
                                      {segment.roadQuality && getRoadConditionsIcon(segment.roadQuality)}
                                      {segment.restrictions && segment.restrictions.length > 0 && (
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="map" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-[400px] rounded-md overflow-hidden">
                      <Map
                        center={{ lat: selectedRouteData.origin.latitude, lng: selectedRouteData.origin.longitude }}
                        zoom={10}
                        origin={{ lat: selectedRouteData.origin.latitude, lng: selectedRouteData.origin.longitude }}
                        destination={{ lat: selectedRouteData.destination.latitude, lng: selectedRouteData.destination.longitude }}
                        waypoints={selectedRouteData.waypoints.map(wp => ({ lat: wp.latitude, lng: wp.longitude }))}
                        polyline={selectedRouteData.polyline}
                        showRoads={true}
                        showTraffic={true}
                        showWeather={selectedRouteData.weatherImpact !== 'none'}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comparison" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Route</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Tolls</TableHead>
                          <TableHead>Safety</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routes.map((route) => (
                          <TableRow key={route.id} className={selectedRoute === route.id ? 'bg-muted' : ''}>
                            <TableCell className="font-medium">
                              {route.name}
                              {route.isRecommended && (
                                <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                                  Recommended
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{route.distance} km</TableCell>
                            <TableCell>{route.duration} hr</TableCell>
                            <TableCell>{formatCurrency(route.totalCost)}</TableCell>
                            <TableCell>{route.tolls.length}</TableCell>
                            <TableCell>{route.safetyScore}/100</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {getWeatherIcon(route.weather)}
                                {getRoadConditionsIcon(route.roadConditions)}
                                {route.restrictions.length > 0 && (
                                  <AlertTriangle className="h-4 w-4 text-amber-500" title="Has restrictions" />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleConfirmRoute}
              disabled={!selectedRoute}
              size="lg"
            >
              <Truck className="mr-2 h-5 w-5" />
              Select This Route
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteCompare; 