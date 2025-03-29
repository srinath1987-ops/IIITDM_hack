import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTollPlazas, getTollRates } from '@/services/supabaseService';
import { Badge } from '@/components/ui/badge';

const TollPlazaList = () => {
  // Fetch toll plazas with their locations
  const { data: tollPlazas = [], isLoading: isLoadingPlazas } = useQuery({
    queryKey: ['tollPlazas'],
    queryFn: getTollPlazas,
  });

  // For each toll plaza, fetch rates for different vehicle types
  const tollRatesQueries = useQuery({
    queryKey: ['tollRates'],
    queryFn: async () => {
      if (tollPlazas.length === 0) return {};
      
      const ratesPromises = tollPlazas.map(async (plaza) => {
        const rates = await getTollRates(plaza.id);
        return { plazaId: plaza.id, rates };
      });
      
      const results = await Promise.all(ratesPromises);
      
      // Convert to object with plaza IDs as keys
      const ratesByPlaza = results.reduce((acc, { plazaId, rates }) => {
        acc[plazaId] = rates;
        return acc;
      }, {});
      
      return ratesByPlaza;
    },
    enabled: tollPlazas.length > 0,
  });

  if (isLoadingPlazas) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Toll Plazas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">Loading toll plaza information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toll Plazas & Rates</CardTitle>
      </CardHeader>
      <CardContent>
        {tollPlazas.length === 0 ? (
          <div className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">No toll plaza information available</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Toll Plaza</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Highway</TableHead>
                <TableHead className="text-right">Vehicle Rates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tollPlazas.map((plaza) => {
                const location = plaza.locations || { name: 'Unknown', address: '', city: '', state: '' };
                const rates = tollRatesQueries.data?.[plaza.id] || [];
                
                return (
                  <TableRow key={plaza.id}>
                    <TableCell className="font-medium">
                      {plaza.name}
                      {plaza.is_fastag_enabled && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                          FASTag
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {location.name}, {location.city || ''} {location.state || ''}
                    </TableCell>
                    <TableCell>{plaza.highway_name || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end space-y-1">
                        {rates.length === 0 ? (
                          <span className="text-muted-foreground text-sm">No rates available</span>
                        ) : (
                          rates.map((rate, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{rate.vehicle_type}:</span> ₹{rate.rate}
                            </div>
                          ))
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TollPlazaList; 