import React from 'react';
import MainLayout from '@/components/MainLayout';
import TollPlazaList from '@/components/TollPlazaList';
import FuelPriceTable from '@/components/FuelPriceTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Pricing = () => {
  return (
    <MainLayout>
      <div className="pt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Pricing Information</h1>
          <p className="text-muted-foreground">
            Current toll rates and fuel prices to help plan your journey
          </p>
        </div>
        
        <Tabs defaultValue="tolls" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tolls">Toll Rates</TabsTrigger>
            <TabsTrigger value="fuel">Fuel Prices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tolls" className="space-y-6">
            <TollPlazaList />
          </TabsContent>
          
          <TabsContent value="fuel" className="space-y-6">
            <FuelPriceTable />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Pricing;
