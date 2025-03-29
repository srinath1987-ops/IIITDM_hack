
import React from 'react';
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

// Mock data for dashboard
const mockSavingsData = [
  { month: 'Jan', timeSaved: 5, tollSaved: 1200, fuelSaved: 1800 },
  { month: 'Feb', timeSaved: 7, tollSaved: 1500, fuelSaved: 2100 },
  { month: 'Mar', timeSaved: 4, tollSaved: 1100, fuelSaved: 1600 },
  { month: 'Apr', timeSaved: 8, tollSaved: 1700, fuelSaved: 2300 },
  { month: 'May', timeSaved: 9, tollSaved: 1900, fuelSaved: 2500 },
  { month: 'Jun', timeSaved: 7, tollSaved: 1600, fuelSaved: 2200 },
];

const mockTripFrequency = [
  { month: 'Jan', trips: 8 },
  { month: 'Feb', trips: 12 },
  { month: 'Mar', trips: 7 },
  { month: 'Apr', trips: 14 },
  { month: 'May', trips: 16 },
  { month: 'Jun', trips: 13 },
];

const totalTollSaved = mockSavingsData.reduce((acc, curr) => acc + curr.tollSaved, 0);
const totalFuelSaved = mockSavingsData.reduce((acc, curr) => acc + curr.fuelSaved, 0);
const totalTimeSaved = mockSavingsData.reduce((acc, curr) => acc + curr.timeSaved, 0);
const totalSaved = totalTollSaved + totalFuelSaved;

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="pt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your savings summary.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTimeSaved} hours</div>
              <p className="text-xs text-muted-foreground">
                Compared to longest routes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toll Saved</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalTollSaved.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From optimal route selection
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalFuelSaved.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Based on current diesel prices
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="month" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Savings Analysis</h2>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="month" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Savings Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockSavingsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tollSaved" name="Toll Saved (₹)" stackId="a" fill="#0ea5e9" />
                      <Bar dataKey="fuelSaved" name="Fuel Saved (₹)" stackId="a" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Travel Frequency</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLine
                      data={mockTripFrequency}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="trips" name="Number of Trips" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </RechartLine>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="year" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Annual Savings View</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Yearly data will be shown here with expanded view</p>
                <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">Historical yearly data will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Earned Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`border ${totalSaved >= 10000 ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
                  totalSaved >= 10000 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Star Badge</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Save ₹10,000+ in a year
                </p>
                <div className="mt-4 text-sm">
                  {totalSaved >= 10000 ? (
                    <span className="text-amber-600 font-medium">Unlocked!</span>
                  ) : (
                    <span className="text-gray-500">
                      ₹{totalSaved.toLocaleString()} / ₹10,000
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border ${totalSaved >= 50000 ? 'border-amber-600 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
                  totalSaved >= 50000 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Gold Badge</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Save ₹50,000+ in a year
                </p>
                <div className="mt-4 text-sm">
                  {totalSaved >= 50000 ? (
                    <span className="text-amber-600 font-medium">Unlocked!</span>
                  ) : (
                    <span className="text-gray-500">
                      ₹{totalSaved.toLocaleString()} / ₹50,000
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border ${totalSaved >= 100000 ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
                  totalSaved >= 100000 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-bold text-lg mb-1">₹10,000 Bonus</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Save ₹100,000+ in a year
                </p>
                <div className="mt-4 text-sm">
                  {totalSaved >= 100000 ? (
                    <span className="text-green-600 font-medium">Unlocked!</span>
                  ) : (
                    <span className="text-gray-500">
                      ₹{totalSaved.toLocaleString()} / ₹100,000
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
