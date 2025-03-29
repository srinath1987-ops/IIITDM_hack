import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Calendar, 
  MapPin, 
  Truck, 
  Package, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Info
} from 'lucide-react';
import { getUserTravelHistory } from '@/services/supabaseService';
import { TravelHistory } from '@/integrations/supabase/database.types';

const processChartData = (travelHistory: TravelHistory[]) => {
  if (!travelHistory || travelHistory.length === 0) {
    // Default data if no history
    return {
      chartData: Array(5).fill(0).map((_, i) => ({
        date: `0${i+1}`,
        tollCost: Math.floor(Math.random() * 1000),
        fuelCost: Math.floor(Math.random() * 2000),
        distance: Math.floor(Math.random() * 300) + 100,
      })),
      avgTollCost: 500,
      avgFuelCost: 2000,
      totalDistance: 1500,
    };
  }

  // Process actual history data
  const chartData = travelHistory.slice(0, 5).map(trip => {
    const date = trip.actual_start_time 
      ? new Date(trip.actual_start_time).getDate().toString().padStart(2, '0')
      : '00';
    
    return {
      date,
      tollCost: trip.actual_toll_cost || 0,
      fuelCost: trip.actual_fuel_cost || 0,
      distance: trip.actual_distance || 0,
    };
  });

  const avgTollCost = travelHistory.reduce((sum, trip) => sum + (trip.actual_toll_cost || 0), 0) / travelHistory.length;
  const avgFuelCost = travelHistory.reduce((sum, trip) => sum + (trip.actual_fuel_cost || 0), 0) / travelHistory.length;
  const totalDistance = travelHistory.reduce((sum, trip) => sum + (trip.actual_distance || 0), 0);

  return {
    chartData,
    avgTollCost,
    avgFuelCost,
    totalDistance,
  };
};

const History = () => {
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [showDataWarning, setShowDataWarning] = useState(true);
  
  const { data: travelHistory, isLoading } = useQuery({
    queryKey: ['travelHistory'],
    queryFn: getUserTravelHistory,
  });

  const toggleTripDetails = (tripId: string) => {
    if (expandedTrip === tripId) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(tripId);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Handle loading state with fallback data
  const history = travelHistory || [];
  
  // Check if any route has missing location or vehicle data
  const hasMissingData = history.some(trip => 
    !trip.route?.origin?.name || 
    !trip.route?.destination?.name || 
    !trip.route?.vehicle?.name
  );
  
  const { chartData, avgTollCost, avgFuelCost, totalDistance } = processChartData(history);

  // Generate a string showing location details with coordinates
  const formatLocationWithCoords = (location: any) => {
    if (!location || !location.name) return 'Unknown';
    
    if (location.latitude && location.longitude) {
      return `${location.name} (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`;
    }
    
    return location.name;
  };

  return (
    <MainLayout>
      <div className="pt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Travel History</h1>
          <p className="text-muted-foreground">
            Review your past journeys and analytics
          </p>
        </div>
        
        {hasMissingData && showDataWarning && (
          <Alert className="mb-6 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-500">Missing location data detected</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              Some of your trips show "Unknown" for location or vehicle information. Our system 
              now uses geolocation data to identify places. Run the data update script to fix this issue.
            </AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700"
              onClick={() => setShowDataWarning(false)}
            >
              Dismiss
            </Button>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDistance.toFixed(0)} km</div>
              <p className="text-xs text-muted-foreground">
                From {history.length} trips
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Toll Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(avgTollCost)}</div>
              <p className="text-xs text-muted-foreground">
                Per trip
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Fuel Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(avgFuelCost)}</div>
              <p className="text-xs text-muted-foreground">
                Per trip
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tollCost" name="Toll Cost (₹)" fill="#0ea5e9" />
                    <Bar dataKey="fuelCost" name="Fuel Cost (₹)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distance Trends</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="distance" name="Distance (km)" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Past Trips</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading travel history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">No travel history found. Start planning your first route!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                      <TableHead className="text-right">Distance</TableHead>
                      <TableHead className="hidden md:table-cell text-right">Costs</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((trip) => (
                      <React.Fragment key={trip.id}>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(trip.actual_start_time)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className={!trip.route?.origin?.name || !trip.route?.destination?.name ? "text-amber-600 dark:text-amber-500" : ""}>
                                {trip.route?.origin?.name ?? 'Unknown'} → {trip.route?.destination?.name ?? 'Unknown'}
                              </span>
                              {(!trip.route?.origin?.name || !trip.route?.destination?.name) && (
                                <Info className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span className={!trip.route?.vehicle?.name ? "text-amber-600 dark:text-amber-500" : ""}>
                                {trip.route?.vehicle?.name ?? 'Unknown'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {trip.actual_distance ? `${trip.actual_distance.toFixed(0)} km` : 'N/A'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-right">
                            ₹{((trip.actual_toll_cost || 0) + (trip.actual_fuel_cost || 0)).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleTripDetails(trip.id)}
                            >
                              Details
                              {expandedTrip === trip.id ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        
                        {expandedTrip === trip.id && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-muted/50">
                              <div className="grid gap-4 md:grid-cols-3 p-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Journey Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Start:</span>
                                      <span>{formatDate(trip.actual_start_time)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">End:</span>
                                      <span>{formatDate(trip.actual_end_time)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Distance:</span>
                                      <span>{trip.actual_distance ? `${trip.actual_distance.toFixed(0)} km` : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Rating:</span>
                                      <span>{trip.rating ? `${trip.rating}/5` : 'Not rated'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Cost Breakdown</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Toll Charges:</span>
                                      <span>₹{(trip.actual_toll_cost || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Fuel Expenses:</span>
                                      <span>₹{(trip.actual_fuel_cost || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                      <span>Total Cost:</span>
                                      <span>₹{((trip.actual_toll_cost || 0) + (trip.actual_fuel_cost || 0)).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Cargo Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Vehicle:</span>
                                      <span>{trip.route?.vehicle?.name ?? 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Cargo Type:</span>
                                      <span>{trip.route?.cargo_type ?? 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Weight:</span>
                                      <span>{trip.route?.cargo_weight ? `${trip.route.cargo_weight} tons` : 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {trip.notes && (
                                  <div className="md:col-span-3">
                                    <h4 className="text-sm font-semibold mb-2">Notes</h4>
                                    <p className="text-sm text-muted-foreground p-3 bg-background border rounded-md">
                                      {trip.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
