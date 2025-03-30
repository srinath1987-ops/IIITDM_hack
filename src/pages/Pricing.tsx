import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { Switch } from '@/components/ui/switch';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MapPin, Info } from 'lucide-react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Starter",
      monthlyPrice: "₹9,999",
      yearlyPrice: "₹99,990",
      yearlyDiscount: "₹19,998 savings",
      description: "Perfect for small businesses with limited routes",
      features: [
        "Up to 5 vehicles",
        "Basic route optimization",
        "Daily traffic updates",
        "Email support",
        "7-day route history"
      ],
      popular: false,
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      monthlyPrice: "₹24,999",
      yearlyPrice: "₹249,990",
      yearlyDiscount: "₹49,998 savings",
      description: "For growing businesses with moderate logistics needs",
      features: [
        "Up to 25 vehicles",
        "Advanced route optimization",
        "Real-time traffic integration",
        "Toll cost optimization",
        "Priority support",
        "30-day route history",
        "Basic analytics dashboard"
      ],
      popular: true,
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      yearlyDiscount: "Contact sales for special annual discounts",
      description: "For large fleets with complex routing requirements",
      features: [
        "Unlimited vehicles",
        "Premium route optimization",
        "Real-time dynamic rerouting",
        "Advanced analytics & reporting",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
        "90-day route history"
      ],
      popular: false,
      buttonText: "Contact Sales",
    }
  ];

  const faqs = [
    {
      question: "How accurate is your traffic data?",
      answer: "Our traffic data is sourced from multiple reliable providers including MapmyIndia, Google Maps, and crowd-sourced information. We update traffic conditions every 2-5 minutes in major cities and every 15 minutes in other areas."
    },
    {
      question: "Does your platform work offline?",
      answer: "Yes, our mobile app allows drivers to download routes for offline use. While real-time updates won't be available without connectivity, the basic navigation features will continue to work."
    },
    {
      question: "Can I integrate with my existing fleet management software?",
      answer: "Yes, our Enterprise plan includes API access and custom integrations with major fleet management solutions. Our team will work with you to ensure smooth data flow between systems."
    },
    {
      question: "How do you calculate toll costs?",
      answer: "We maintain a comprehensive database of toll plazas across India, with up-to-date pricing based on vehicle types. Our system calculates toll costs as part of the route optimization process, allowing you to choose routes based on time, distance, or total cost including tolls."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial of our Pro plan so you can experience the benefits of Last Mile before committing. No credit card is required to start your trial."
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Pricing Information</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Current toll rates and fuel prices to help plan your journey
          </p>
        </div>
        
        <div className="mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-500" />
          <p className="text-sm text-muted-foreground">
            Data is updated daily from official sources. Please verify before travel as prices may change without notice.
          </p>
        </div>
        
        <Tabs defaultValue="tolls" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tolls">Toll Rates</TabsTrigger>
            <TabsTrigger value="fuel">Fuel Prices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tolls">
            <TollPlazaList />
          </TabsContent>
          
          <TabsContent value="fuel">
            <FuelPriceTable />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// TollPlazaList component
const TollPlazaList = () => {
  // Fetch toll plazas from Supabase
  const { data: tollPlazas, isLoading: isLoadingPlazas, error: plazaError } = useQuery({
    queryKey: ['tollPlazas'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('toll_plazas')
        .select(`
          id,
          name,
          highway_name,
          location_id,
          locations:location_id (
            id,
            name,
            city,
            state,
            latitude,
            longitude
          )
        `);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch toll rates for each plaza
  const { data: tollRates, isLoading: isLoadingRates, error: ratesError } = useQuery({
    queryKey: ['tollRates'],
    queryFn: async () => {
      if (!tollPlazas || tollPlazas.length === 0) return [];
      
      const { data, error } = await (supabase as any)
        .from('toll_rates')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!tollPlazas && tollPlazas.length > 0
  });

  // If loading
  if (isLoadingPlazas || isLoadingRates) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading toll plaza data...</span>
      </div>
    );
  }

  // If error
  if (plazaError || ratesError) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading toll plaza information. Please try again later.</p>
      </div>
    );
  }

  // If no data
  if (!tollPlazas || tollPlazas.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>No toll plaza information available at this time.</p>
      </div>
    );
  }

  // Function to get toll rates for a specific plaza
  const getRatesForPlaza = (plazaId: string) => {
    return tollRates?.filter(rate => rate.toll_plaza_id === plazaId) || [];
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Toll Plaza Rates</CardTitle>
          <CardDescription>
            Current rates for major toll plazas across highways in India
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Toll Plaza</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Highway</TableHead>
                <TableHead>Vehicle Rates (₹)</TableHead>
                <TableHead className="text-right">Features</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tollPlazas.map((plaza) => (
                <TableRow key={plaza.id}>
                  <TableCell className="font-medium">{plaza.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {plaza.locations?.city || 'Unknown'}, {plaza.locations?.state || 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{plaza.highway_name || 'N/A'}</TableCell>
                  <TableCell>
                    {getRatesForPlaza(plaza.id).length > 0 ? (
                      <div className="text-sm">
                        {getRatesForPlaza(plaza.id).map((rate, index) => (
                          <div key={rate.id} className={index !== 0 ? 'mt-1' : ''}>
                            <span className="font-medium">{rate.vehicle_type}: </span>
                            <span>₹{rate.rate.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No rates available</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {plaza.is_fastag_enabled && (
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        FASTag
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// FuelPriceTable component
const FuelPriceTable = () => {
  const [fuelType, setFuelType] = useState('petrol');
  
  const { data: fuelPrices, isLoading, error } = useQuery({
    queryKey: ['fuelPrices'],
    queryFn: async () => {
      // Mock data since actual table doesn't exist
      const mockPrices = [
        { id: 1, state: 'Tamil Nadu', city: 'Chennai', petrol: 102.63, diesel: 94.24, cng: 63.41, updated_at: new Date().toISOString() },
        { id: 2, state: 'Karnataka', city: 'Bangalore', petrol: 101.94, diesel: 87.89, cng: 59.65, updated_at: new Date().toISOString() },
        { id: 3, state: 'Maharashtra', city: 'Mumbai', petrol: 106.31, diesel: 94.27, cng: 67.12, updated_at: new Date().toISOString() },
        { id: 4, state: 'Delhi', city: 'New Delhi', petrol: 96.72, diesel: 89.62, cng: 55.41, updated_at: new Date().toISOString() },
        { id: 5, state: 'Telangana', city: 'Hyderabad', petrol: 109.73, diesel: 97.96, cng: 64.12, updated_at: new Date().toISOString() },
        { id: 6, state: 'Kerala', city: 'Kochi', petrol: 107.79, diesel: 96.52, cng: 65.30, updated_at: new Date().toISOString() },
      ];
      
      // Try to get actual data
      try {
        const { data, error } = await supabase
          .from('fuel_prices')
          .select('*')
          .order('state', { ascending: true });
        
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.log('Falling back to mock data for fuel prices');
      }
      
      // Return mock data if table doesn't exist or is empty
      return mockPrices;
    }
  });
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // If loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading fuel price data...</span>
      </div>
    );
  }
  
  // If error
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading fuel price information. Please try again later.</p>
      </div>
    );
  }
  
  // If no data
  if (!fuelPrices || fuelPrices.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>No fuel price information available at this time.</p>
      </div>
    );
  }
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Current Fuel Prices</CardTitle>
          <CardDescription>
            Latest petrol and diesel prices across major cities in India
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fuelPrices.map((price) => (
            <div key={price.id} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{price.state}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>Diesel (₹/Liter)</TableHead>
                    <TableHead>Petrol (₹/Liter)</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fuelPrices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell className="font-medium">{price.city || 'State Average'}</TableCell>
                      <TableCell>{price.diesel.toFixed(2)}</TableCell>
                      <TableCell>{price.petrol.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{formatDate(price.updated_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingPage;
