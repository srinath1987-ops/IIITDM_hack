import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MainLayout } from '@/components/MainLayout';
import Map from '@/components/Map';
import RouteDetails from '@/components/RouteDetails';
import { Download, Share, Printer } from 'lucide-react';
import { optimizeRoute, RouteOptimizationRequest } from '@/integrations/ai/routeOptimizationService';
import { toast } from '@/components/ui/use-toast';
import { getVehicles, getLocations, getLatestFuelPrices, getTollPlazas } from '@/services/supabaseService';

const RouteDetailsPage: React.FC = () => {
  const router = useRouter();
  const { routeId, origin, destination, vehicleType, weight } = router.query;
  
  // Fetch locations from Supabase
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });
  
  // Fetch vehicles from Supabase
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });
  
  // Fetch fuel prices 
  const { data: fuelPrices = [], isLoading: isLoadingFuelPrices } = useQuery({
    queryKey: ['fuelPrices'],
    queryFn: getLatestFuelPrices,
  });
  
  // Fetch toll plazas
  const { data: tollPlazas = [], isLoading: isLoadingTollPlazas } = useQuery({
    queryKey: ['tollPlazas'],
    queryFn: getTollPlazas,
  });
  
  // Find the origin and destination locations from the database
  const originLocation = locations.find(loc => loc.name === origin);
  const destinationLocation = locations.find(loc => loc.name === destination);
  const selectedVehicle = vehicles.find(v => v.id === vehicleType);
  
  // Create a request for route optimization
  const routeRequest: RouteOptimizationRequest | undefined = originLocation && destinationLocation ? {
    origin: {
      id: originLocation.id,
      name: originLocation.name,
      latitude: originLocation.latitude,
      longitude: originLocation.longitude,
      state: originLocation.state || undefined
    },
    destination: {
      id: destinationLocation.id,
      name: destinationLocation.name,
      latitude: destinationLocation.latitude,
      longitude: destinationLocation.longitude,
      state: destinationLocation.state || undefined
    },
    vehicleType: vehicleType as string || 'truck',
    weight: parseFloat(weight as string) || 10,
    preferences: {
      prioritizeSafety: false,
      prioritizeSpeed: true,
      prioritizeCost: false,
      avoidTolls: false,
      avoidHighways: false,
    },
  } : undefined;
  
  // Fetch the route data
  const { data: routes, isLoading: isLoadingRoutes, error } = useQuery({
    queryKey: ['route', routeId, origin, destination, vehicleType, weight],
    queryFn: () => routeRequest ? optimizeRoute(routeRequest) : Promise.resolve([]),
    enabled: !!routeRequest, // Only enable if we have the request data
  });
  
  // Find the selected route
  const selectedRoute = routes?.find(route => route.id === routeId);
  
  // Loading state
  const isLoading = isLoadingLocations || isLoadingVehicles || isLoadingRoutes || isLoadingFuelPrices || isLoadingTollPlazas;
  
  // Determine fuel price for origin state
  const getOriginStateFuelPrice = () => {
    if (!originLocation?.state || fuelPrices.length === 0) return null;
    
    return fuelPrices.find(price => price.state === originLocation.state);
  };
  
  // Mock functions for printing, sharing, and downloading route details
  const handlePrintRoute = () => {
    toast({
      title: "Print Initiated",
      description: "Sending route details to printer...",
    });
    window.print();
  };
  
  const handleShareRoute = () => {
    toast({
      title: "Share Feature",
      description: "Sharing functionality would open here",
    });
  };
  
  const handleDownloadRoute = () => {
    if (!selectedRoute) return;
    
    // Create a JSON blob with route data
    const routeData = {
      route: selectedRoute,
      origin: originLocation,
      destination: destinationLocation,
      vehicle: selectedVehicle,
      fuelPrice: getOriginStateFuelPrice(),
      date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(routeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-${selectedRoute.id}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your route details are being downloaded",
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Route Details</h1>
              <p className="text-muted-foreground">
                {originLocation?.name || origin} to {destinationLocation?.name || destination}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrintRoute}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareRoute}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadRoute} disabled={!selectedRoute}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Spinner size="lg" />
            <p className="mt-4">Loading route details...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-500">Error loading route details. Please try again.</p>
                <Button
                  onClick={() => router.push('/RoutePlanner')}
                  variant="outline"
                  className="mt-4"
                >
                  Back to Route Planner
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !selectedRoute ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p>Route not found. Please select a valid route.</p>
                <Button
                  onClick={() => router.push('/RoutePlanner')}
                  variant="outline"
                  className="mt-4"
                >
                  Back to Route Planner
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden h-[500px]">
                <Map
                  center={{ 
                    lat: (selectedRoute.origin.latitude + selectedRoute.destination.latitude) / 2, 
                    lng: (selectedRoute.origin.longitude + selectedRoute.destination.longitude) / 2 
                  }}
                  zoom={7}
                  origin={{ 
                    lat: selectedRoute.origin.latitude, 
                    lng: selectedRoute.origin.longitude,
                    label: selectedRoute.origin.name
                  }}
                  destination={{ 
                    lat: selectedRoute.destination.latitude, 
                    lng: selectedRoute.destination.longitude,
                    label: selectedRoute.destination.name
                  }}
                  waypoints={selectedRoute.waypoints?.map(wp => ({ 
                    lat: wp.latitude, 
                    lng: wp.longitude,
                    label: wp.name,
                    type: wp.type
                  }))}
                  showRoads={true}
                  showTraffic={true}
                  showWeather={selectedRoute.weatherImpact !== 'none'}
                />
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <RouteDetails 
                route={selectedRoute} 
                fuelPrice={getOriginStateFuelPrice()} 
                tollPlazas={tollPlazas.filter(plaza => 
                  selectedRoute.tolls.some(toll => toll.id === plaza.id)
                )}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RouteDetailsPage; 