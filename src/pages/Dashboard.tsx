import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart as RechartLine, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Clock, Coins, Droplet } from 'lucide-react';
import { getUserTravelHistory } from '@/services/supabaseService';
import { TravelHistory } from '@/integrations/supabase/database.types';

// Function to calculate savings data from travel history
const calculateSavings = (travelHistory: TravelHistory[]) => {
  // Group by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  // Initialize data for current year with all months
  const savingsData = months.map(month => ({
    month,
    timeSaved: 0,
    tollSaved: 0,
    fuelSaved: 0,
  }));
  
  // Calculate trip frequency
  const tripFrequency = months.map(month => ({
    month,
    trips: 0,
  }));
  
  // Process travel history
  travelHistory.forEach(entry => {
    if (!entry.actual_start_time) return;
    
    const date = new Date(entry.actual_start_time);
    if (date.getFullYear() !== currentYear) return;
    
    const monthIndex = date.getMonth();
    
    // Assume that each entry has some estimated savings data (in a real app, this would be calculated)
    // For now, we'll use actual costs as a proxy for savings (10% of actual costs as estimated savings)
    const tollSaved = (entry.actual_toll_cost || 0) * 0.1;
    const fuelSaved = (entry.actual_fuel_cost || 0) * 0.1;
    
    // Assume 30 minutes saved per trip on average
    const timeSaved = 0.5;
    
    savingsData[monthIndex].tollSaved += Math.round(tollSaved);
    savingsData[monthIndex].fuelSaved += Math.round(fuelSaved);
    savingsData[monthIndex].timeSaved += timeSaved;
    
    // Increment trip count
    tripFrequency[monthIndex].trips += 1;
  });
  
  return {
    savingsData,
    tripFrequency,
    totalTollSaved: savingsData.reduce((acc, curr) => acc + curr.tollSaved, 0),
    totalFuelSaved: savingsData.reduce((acc, curr) => acc + curr.fuelSaved, 0),
    totalTimeSaved: savingsData.reduce((acc, curr) => acc + curr.timeSaved, 0),
  };
};

const Dashboard = () => {
  const { data: travelHistory, isLoading } = useQuery({
    queryKey: ['travelHistory'],
    queryFn: getUserTravelHistory,
  });
  
  const [savingsData, setSavingsData] = useState<any[]>([]);
  const [tripFrequency, setTripFrequency] = useState<any[]>([]);
  const [totalTollSaved, setTotalTollSaved] = useState(0);
  const [totalFuelSaved, setTotalFuelSaved] = useState(0);
  const [totalTimeSaved, setTotalTimeSaved] = useState(0);
  
  useEffect(() => {
    if (travelHistory && travelHistory.length > 0) {
      const { 
        savingsData: calculatedSavings, 
        tripFrequency: calculatedTrips,
        totalTollSaved: calculatedTollSaved,
        totalFuelSaved: calculatedFuelSaved,
        totalTimeSaved: calculatedTimeSaved,
      } = calculateSavings(travelHistory);
      
      setSavingsData(calculatedSavings);
      setTripFrequency(calculatedTrips);
      setTotalTollSaved(calculatedTollSaved);
      setTotalFuelSaved(calculatedFuelSaved);
      setTotalTimeSaved(calculatedTimeSaved);
    } else if (!isLoading) {
      // If there's no travel history but loading has completed,
      // use some default mock data for better UX
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      setSavingsData(months.map(month => ({
        month,
        timeSaved: Math.floor(Math.random() * 10),
        tollSaved: Math.floor(Math.random() * 1000) + 500,
        fuelSaved: Math.floor(Math.random() * 1500) + 1000,
      })));
      
      setTripFrequency(months.map(month => ({
        month,
        trips: Math.floor(Math.random() * 10) + 5,
      })));
      
      setTotalTollSaved(5000);
      setTotalFuelSaved(7000);
      setTotalTimeSaved(30);
    }
  }, [travelHistory, isLoading]);
  
  const totalSaved = totalTollSaved + totalFuelSaved;

  return (
    <MainLayout>
      <div className="pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Welcome back! Here's your savings summary.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{totalTimeSaved} hours</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Compared to longest routes
              </p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Toll Saved</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">₹{totalTollSaved.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                From optimal route selection
              </p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Fuel Saved</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">₹{totalFuelSaved.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Based on current diesel prices
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="month" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white">Savings Analysis</h2>
            <TabsList className="dark:bg-gray-700">
              <TabsTrigger value="month" className="dark:data-[state=active]:bg-gray-600">Month</TabsTrigger>
              <TabsTrigger value="year" className="dark:data-[state=active]:bg-gray-600">Year</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="month" className="space-y-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Savings Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={savingsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }} />
                      <Legend />
                      <Bar dataKey="tollSaved" name="Toll Saved (₹)" stackId="a" fill="#0ea5e9" />
                      <Bar dataKey="fuelSaved" name="Fuel Saved (₹)" stackId="a" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Travel Frequency</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLine
                      data={tripFrequency}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }} />
                      <Legend />
                      <Line type="monotone" dataKey="trips" name="Number of Trips" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </RechartLine>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="year" className="space-y-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Annual Savings View</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground dark:text-gray-400 mb-4">Yearly data will be shown here with expanded view</p>
                <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md dark:border-gray-700">
                  <p className="text-muted-foreground dark:text-gray-400">Historical yearly data will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Earned Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`border ${totalSaved >= 10000 ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
                  totalSaved >= 10000 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                }`}>
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className={`font-bold text-lg mb-1 ${totalSaved >= 10000 ? 'text-amber-700 dark:text-amber-400' : 'dark:text-gray-300'}`}>Star Badge</h3>
                <p className="text-sm text-center text-muted-foreground dark:text-gray-400">
                  Save ₹10,000+ in a year
                </p>
                <div className="mt-4 text-sm">
                  {totalSaved >= 10000 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Unlocked!</span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      ₹{totalSaved.toLocaleString()} / ₹10,000
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border ${totalSaved >= 25000 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
                  totalSaved >= 25000 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                }`}>
                  <span className="text-2xl">🔹</span>
                </div>
                <h3 className={`font-bold text-lg mb-1 ${totalSaved >= 25000 ? 'text-indigo-700 dark:text-indigo-400' : 'dark:text-gray-300'}`}>Diamond Badge</h3>
                <p className="text-sm text-center text-muted-foreground dark:text-gray-400">
                  Save ₹25,000+ in a year
                </p>
                <div className="mt-4 text-sm">
                  {totalSaved >= 25000 ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">Unlocked!</span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      ₹{totalSaved.toLocaleString()} / ₹25,000
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border ${totalSaved >= 50000 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
                  totalSaved >= 50000 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                }`}>
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className={`font-bold text-lg mb-1 ${totalSaved >= 50000 ? 'text-emerald-700 dark:text-emerald-400' : 'dark:text-gray-300'}`}>Eco Warrior</h3>
                <p className="text-sm text-center text-muted-foreground dark:text-gray-400">
                  Save ₹50,000+ in a year
                </p>
                <div className="mt-4 text-sm">
                  {totalSaved >= 50000 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Unlocked!</span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      ₹{totalSaved.toLocaleString()} / ₹50,000
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
