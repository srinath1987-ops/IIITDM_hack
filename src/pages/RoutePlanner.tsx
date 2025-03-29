import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Map from '@/components/Map';
import RouteCompare from '@/components/RouteCompare';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, Package, MapPin, Search, ArrowRight, Clock, Shuffle, Shield, Banknote } from 'lucide-react';
import { 
  optimizeRoute, 
  RouteOptimizationRequest, 
  RouteOptimizationResponse 
} from '@/integrations/ai/routeOptimizationService';
import { getVehicles, getLocations } from '@/services/supabaseService';
import { Vehicle, Location } from '@/integrations/supabase/database.types';

// Form schema using zod
const formSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  weight: z.coerce.number().min(0.1, "Weight must be at least 0.1"),
  goodsType: z.string().optional(),
  prioritizeSafety: z.boolean().default(false),
  prioritizeSpeed: z.boolean().default(false),
  prioritizeCost: z.boolean().default(false),
  avoidTolls: z.boolean().default(false),
  avoidHighways: z.boolean().default(false),
  dimensions: z.object({
    length: z.coerce.number().min(0).optional(),
    width: z.coerce.number().min(0).optional(),
    height: z.coerce.number().min(0).optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Goods types from our database
const goodsTypes = [
  { value: 'general', label: 'General Cargo' },
  { value: 'perishable', label: 'Perishable Goods' },
  { value: 'fragile', label: 'Fragile Items' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'hazardous', label: 'Hazardous Materials' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'livestock', label: 'Livestock' },
];

const RoutePlanner: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('form');
  const [routes, setRoutes] = useState<RouteOptimizationResponse[]>([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [routesError, setRoutesError] = useState<Error | null>(null);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>({lat: 20.5937, lng: 78.9629});
  const [mapZoom, setMapZoom] = useState(5);
  
  // Fetch vehicles from Supabase
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });
  
  // Fetch locations from Supabase
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });
  
  // Use react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: '',
      destination: '',
      vehicleType: '',
      weight: 10,
      goodsType: 'general',
      prioritizeSafety: false,
      prioritizeSpeed: false,
      prioritizeCost: false,
      avoidTolls: false,
      avoidHighways: false,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
    },
  });
  
  // Set map center based on selected origin
  useEffect(() => {
    const originValue = form.watch('origin');
    if (originValue && locations.length > 0) {
      const originLocation = locations.find(loc => loc.name === originValue);
      if (originLocation) {
        setMapCenter({
          lat: originLocation.latitude,
          lng: originLocation.longitude
        });
        setMapZoom(9);
      }
    }
  }, [form.watch('origin'), locations]);
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    // Convert form values to the request format
    const originLocation = locations.find(loc => loc.name === values.origin);
    const destinationLocation = locations.find(loc => loc.name === values.destination);
    
    if (!originLocation || !destinationLocation) {
      toast({
        title: "Error",
        description: "Please select valid origin and destination locations",
        variant: "destructive",
      });
      return;
    }
    
    const request: RouteOptimizationRequest = {
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
      vehicleType: values.vehicleType,
      weight: values.weight,
      goodsType: values.goodsType,
      dimensions: values.dimensions,
      preferences: {
        prioritizeSafety: values.prioritizeSafety,
        prioritizeSpeed: values.prioritizeSpeed,
        prioritizeCost: values.prioritizeCost,
        avoidTolls: values.avoidTolls,
        avoidHighways: values.avoidHighways,
      },
    };
    
    // Show loading state
    setRoutesLoading(true);
    setRoutesError(null);
    
    // Call the route optimization function
    optimizeRoute(request)
      .then((result) => {
        setRoutes(result);
        setActiveTab('results');
        setRoutesLoading(false);
      })
      .catch((error) => {
        setRoutesError(error);
        setRoutesLoading(false);
        toast({
          title: "Error",
          description: "Failed to find routes. Please try again.",
          variant: "destructive",
        });
        console.error("Error finding routes:", error);
      });
  };
  
  // Select a specific route to view details
  const handleSelectRoute = (routeId: string) => {
    // Get the form values for query params
    const values = form.getValues();
    
    // Navigate to the route details page with the route ID and form values as query params
    router.push({
      pathname: '/RouteDetails',
      query: {
        routeId,
        origin: values.origin,
        destination: values.destination,
        vehicleType: values.vehicleType,
        weight: values.weight,
      },
    });
  };
  
  // Handle map click - we could use this to set origin/destination
  const handleMapClick = (lat: number, lng: number) => {
    // Find the nearest location to the clicked point
    if (locations.length === 0) return;
    
    // Simple distance calculation for demo purposes
    let nearest = locations[0];
    let minDist = Number.MAX_VALUE;
    
    locations.forEach(loc => {
      const dist = Math.sqrt(
        Math.pow(loc.latitude - lat, 2) + 
        Math.pow(loc.longitude - lng, 2)
      );
      
      if (dist < minDist) {
        minDist = dist;
        nearest = loc;
      }
    });
    
    // If we're missing origin, set it first
    const currentOrigin = form.getValues('origin');
    const currentDestination = form.getValues('destination');
    
    if (!currentOrigin) {
      form.setValue('origin', nearest.name);
      toast({
        title: "Origin Set",
        description: `Origin set to ${nearest.name}`,
      });
    } else if (!currentDestination) {
      form.setValue('destination', nearest.name);
      toast({
        title: "Destination Set",
        description: `Destination set to ${nearest.name}`,
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Route Planner</h1>
            <p className="text-muted-foreground">Plan your route with AI-powered optimization</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="form">Route Form</TabsTrigger>
            <TabsTrigger value="results" disabled={routes.length === 0}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Route Information</CardTitle>
                    <CardDescription>Enter your route details to find the best options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="origin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Origin</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select origin location" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {locations.map((location) => (
                                      <SelectItem key={location.id} value={location.name}>
                                        {location.name} {location.state ? `(${location.state})` : ''}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  You can also click on the map to set a location
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="destination"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Destination</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select destination location" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {locations.map((location) => (
                                      <SelectItem key={location.id} value={location.name}>
                                        {location.name} {location.state ? `(${location.state})` : ''}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="vehicleType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vehicle Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select vehicle type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {vehicles.map((vehicle) => (
                                      <SelectItem key={vehicle.id} value={vehicle.id}>
                                        {vehicle.name} ({vehicle.type})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="goodsType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Goods Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select goods type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {goodsTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  The type of goods being transported
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo Weight (tons)</FormLabel>
                              <FormControl>
                                <div className="flex items-center space-x-4">
                                  <Slider 
                                    value={[field.value]} 
                                    min={0.1} 
                                    max={50} 
                                    step={0.1} 
                                    onValueChange={(value) => field.onChange(value[0])}
                                    className="flex-1"
                                  />
                                  <Input 
                                    type="number" 
                                    value={field.value} 
                                    className="w-20" 
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                The weight of your cargo in tons
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Route Preferences</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="prioritizeSafety"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>
                                      <div className="flex items-center">
                                        <Shield className="mr-2 h-4 w-4 text-blue-500" />
                                        Prioritize Safety
                                      </div>
                                    </FormLabel>
                                    <FormDescription>
                                      Prefer safer routes
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="prioritizeSpeed"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>
                                      <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-green-500" />
                                        Prioritize Speed
                                      </div>
                                    </FormLabel>
                                    <FormDescription>
                                      Find the fastest route
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="prioritizeCost"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>
                                      <div className="flex items-center">
                                        <Banknote className="mr-2 h-4 w-4 text-amber-500" />
                                        Prioritize Cost
                                      </div>
                                    </FormLabel>
                                    <FormDescription>
                                      Find the cheapest route
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="avoidTolls"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Avoid Tolls</FormLabel>
                                    <FormDescription>
                                      Try to avoid toll roads
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="avoidHighways"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Avoid Highways</FormLabel>
                                    <FormDescription>
                                      Prefer smaller roads
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            size="lg"
                            disabled={routesLoading || isLoadingVehicles || isLoadingLocations}
                            className="w-full md:w-auto"
                          >
                            {routesLoading ? (
                              <>
                                <Spinner size="sm" className="mr-2" />
                                Finding Routes...
                              </>
                            ) : (
                              <>
                                Find Routes
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="hidden md:block">
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="h-[300px] rounded-md overflow-hidden">
                      <Map 
                        center={mapCenter}
                        zoom={mapZoom}
                        onClick={handleMapClick}
                        origin={form.getValues('origin') ? mapCenter : undefined}
                        showTraffic={true}
                        showWeather={true}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Click on the map to set locations</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Vehicle Selection</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose a vehicle that can handle your cargo weight and dimensions.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Route Preferences</h4>
                      <p className="text-sm text-muted-foreground">
                        You can prioritize safety, speed, or cost based on your needs.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Weather Conditions</h4>
                      <p className="text-sm text-muted-foreground">
                        Our system considers current weather conditions to recommend safer routes.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">FASTag</h4>
                      <p className="text-sm text-muted-foreground">
                        Most recommended routes prioritize toll plazas with FASTag support for faster transit.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            {routesLoading ? (
              <div className="flex justify-center items-center h-96">
                <Spinner size="lg" />
                <span className="ml-2">Finding the best routes for you...</span>
              </div>
            ) : routesError ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-red-500">
                    <p>Error finding routes. Please try again.</p>
                    <Button 
                      onClick={() => setActiveTab('form')} 
                      variant="outline"
                      className="mt-4"
                    >
                      Back to Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : routes.length > 0 ? (
              <RouteCompare 
                routes={routes} 
                onSelectRoute={handleSelectRoute} 
              />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p>No routes found. Please adjust your criteria and try again.</p>
                    <Button 
                      onClick={() => setActiveTab('form')} 
                      variant="outline"
                      className="mt-4"
                    >
                      Back to Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default RoutePlanner; 