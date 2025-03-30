
import React from 'react';
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
  ChevronUp 
} from 'lucide-react';

// Mock travel history data
const mockTravelHistory = [
  {
    id: 1,
    date: '2023-06-10',
    startPoint: 'Chennai',
    endPoint: 'Coimbatore',
    distance: 502,
    duration: 8.5,
    tollCost: 950,
    fuelCost: 3400,
    vehicle: 'Truck',
    goods: 'Construction Materials',
    weight: 18,
  },
  {
    id: 2,
    date: '2023-06-15',
    startPoint: 'Coimbatore',
    endPoint: 'Madurai',
    distance: 211,
    duration: 4.2,
    tollCost: 450,
    fuelCost: 1800,
    vehicle: 'Truck',
    goods: 'Machinery',
    weight: 14,
  },
  {
    id: 3,
    date: '2023-06-18',
    startPoint: 'Madurai',
    endPoint: 'Tiruchirappalli',
    distance: 138,
    duration: 3.0,
    tollCost: 250,
    fuelCost: 1200,
    vehicle: 'Lorry',
    goods: 'Food',
    weight: 5,
  },
  {
    id: 4,
    date: '2023-06-22',
    startPoint: 'Tiruchirappalli',
    endPoint: 'Chennai',
    distance: 334,
    duration: 6.1,
    tollCost: 650,
    fuelCost: 2600,
    vehicle: 'Truck',
    goods: 'Construction Materials',
    weight: 12,
  },
  {
    id: 5,
    date: '2023-06-28',
    startPoint: 'Chennai',
    endPoint: 'Salem',
    distance: 350,
    duration: 6.3,
    tollCost: 600,
    fuelCost: 2700,
    vehicle: '10-Wheeler',
    goods: 'Machinery',
    weight: 22,
  },
];

// Prepare data for charts
const chartData = mockTravelHistory.map(trip => ({
  date: trip.date.split('-')[2], // Just day for simplicity
  tollCost: trip.tollCost,
  fuelCost: trip.fuelCost,
  distance: trip.distance,
}));

const avgTollCost = mockTravelHistory.reduce((sum, trip) => sum + trip.tollCost, 0) / mockTravelHistory.length;
const avgFuelCost = mockTravelHistory.reduce((sum, trip) => sum + trip.fuelCost, 0) / mockTravelHistory.length;
const totalDistance = mockTravelHistory.reduce((sum, trip) => sum + trip.distance, 0);

const History = () => {
  const [expandedTrip, setExpandedTrip] = React.useState<number | null>(null);

  const toggleTripDetails = (tripId: number) => {
    if (expandedTrip === tripId) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(tripId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDistance} km</div>
              <p className="text-xs text-muted-foreground">
                From {mockTravelHistory.length} trips
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
              <CardTitle>Distance Traveled</CardTitle>
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
                    <Line type="monotone" dataKey="distance" name="Distance (km)" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Past Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead className="text-right">Distance</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTravelHistory.map((trip) => (
                    <React.Fragment key={trip.id}>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {formatDate(trip.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            {trip.startPoint} → {trip.endPoint}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{trip.distance} km</TableCell>
                        <TableCell className="text-right">{trip.duration} hrs</TableCell>
                        <TableCell className="text-right">₹{trip.tollCost + trip.fuelCost}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleTripDetails(trip.id)}
                          >
                            {expandedTrip === trip.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {expandedTrip === trip.id && (
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={6}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                              <div>
                                <div className="text-sm font-medium">Vehicle</div>
                                <div className="flex items-center text-sm">
                                  <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {trip.vehicle}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Cargo</div>
                                <div className="flex items-center text-sm">
                                  <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {trip.goods}, {trip.weight} tons
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Breakdown</div>
                                <div className="text-sm grid grid-cols-2 gap-1">
                                  <span>Toll:</span>
                                  <span className="text-right">₹{trip.tollCost}</span>
                                  <span>Fuel:</span>
                                  <span className="text-right">₹{trip.fuelCost}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default History;
