import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getLatestFuelPrices } from '@/services/supabaseService';
import { FuelPrice } from '@/integrations/supabase/database.types';

const FuelPriceTable = () => {
  const { data: fuelPrices = [], isLoading } = useQuery({
    queryKey: ['fuelPrices'],
    queryFn: getLatestFuelPrices,
  });

  // Group fuel prices by state for easier display
  const fuelPricesByState = React.useMemo(() => {
    const groupedPrices: Record<string, FuelPrice[]> = {};
    
    fuelPrices.forEach(price => {
      if (!groupedPrices[price.state]) {
        groupedPrices[price.state] = [];
      }
      groupedPrices[price.state].push(price);
    });
    
    // Sort cities within each state
    Object.keys(groupedPrices).forEach(state => {
      groupedPrices[state].sort((a, b) => {
        if (!a.city && b.city) return -1;
        if (a.city && !b.city) return 1;
        if (!a.city && !b.city) return 0;
        return a.city!.localeCompare(b.city!);
      });
    });
    
    return groupedPrices;
  }, [fuelPrices]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Fuel Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">Loading fuel price information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Fuel Prices</CardTitle>
      </CardHeader>
      <CardContent>
        {fuelPrices.length === 0 ? (
          <div className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">No fuel price information available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(fuelPricesByState).map(([state, prices]) => (
              <div key={state}>
                <h3 className="text-lg font-semibold mb-3">{state}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead className="text-right">Diesel (₹/L)</TableHead>
                      <TableHead className="text-right">Petrol (₹/L)</TableHead>
                      <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prices.map((price) => (
                      <TableRow key={price.id}>
                        <TableCell className="font-medium">
                          {price.city || 'State Average'}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{price.diesel_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{price.petrol_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {formatDate(price.effective_date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FuelPriceTable; 