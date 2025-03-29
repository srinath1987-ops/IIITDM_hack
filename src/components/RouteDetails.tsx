import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Route,
  Clock,
  Banknote,
  Fuel,
  AlertTriangle,
  Info,
  CloudRain,
  Truck,
  Factory,
  Shield,
  Wind,
  Compass,
  BarChart4,
  Gauge,
  Landmark,
  AlertOctagon,
  Leaf,
  Receipt,
  FileText,
  Cloud,
} from 'lucide-react';
import { 
  RouteOptimizationResponse, 
  RouteSegmentInfo, 
  Waypoint
} from '@/integrations/ai/routeOptimizationService';
import { Vehicle, FuelPrice, TollPlaza } from '@/integrations/supabase/database.types';

interface RouteDetailsProps {
  route: RouteOptimizationResponse;
  vehicle?: Vehicle;
  fuelPrice?: FuelPrice | null;
  tollPlazas?: TollPlaza[];
}

const RouteDetails: React.FC<RouteDetailsProps> = ({
  route,
  vehicle,
  fuelPrice,
  tollPlazas = []
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!route) return null;
  
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };
  
  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'Clear':
        return <div className="text-amber-500"><Info className="h-5 w-5" /></div>;
      case 'Rain':
        return <div className="text-blue-500"><CloudRain className="h-5 w-5" /></div>;
      case 'Fog':
        return <div className="text-gray-500"><Wind className="h-5 w-5" /></div>;
      default:
        return <div className="text-gray-500"><Cloud className="h-5 w-5" /></div>;
    }
  };
  
  const getTrafficIcon = (condition: string) => {
    switch(condition) {
      case 'light':
        return <div className="text-green-500"><Route className="h-5 w-5" /></div>;
      case 'moderate':
        return <div className="text-amber-500"><Route className="h-5 w-5" /></div>;
      case 'heavy':
        return <div className="text-red-500"><Route className="h-5 w-5" /></div>;
      default:
        return <div className="text-gray-500"><Route className="h-5 w-5" /></div>;
    }
  };
  
  const getRoadConditionIcon = (condition: string) => {
    switch(condition) {
      case 'good':
        return <div className="text-green-500"><Route className="h-5 w-5" /></div>;
      case 'average':
        return <div className="text-amber-500"><Route className="h-5 w-5" /></div>;
      case 'poor':
        return <div className="text-red-500"><Route className="h-5 w-5" /></div>;
      default:
        return <div className="text-gray-500"><Route className="h-5 w-5" /></div>;
    }
  };
  
  // Calculate emission savings compared to average (hypothetical data)
  const industryAverageEmissions = route.distance * 0.8; // kg CO2
  const emissionsSavingsPercent = Math.round(
    ((industryAverageEmissions - route.emissions) / industryAverageEmissions) * 100
  );
  
  // Get impact from restrictions
  const hasRestrictions = route.restrictions && route.restrictions.length > 0;
  
  // Count stops required
  const restStops = route.waypoints.filter(wp => wp.type === 'rest').length;
  
  // Get current fuel prices if available
  const dieselPrice = fuelPrice?.diesel_price || 90; // Default fallback price
  const actualFuelCost = route.fuelConsumption * dieselPrice;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{route.name}</CardTitle>
            <CardDescription>
              Detailed information about your selected route
            </CardDescription>
          </div>
          {route.isRecommended && (
            <Badge className="bg-green-500 text-white">Recommended</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-xs">Distance</span>
                </div>
                <div className="text-xl font-bold">{route.distance} km</div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-xs">Duration</span>
                </div>
                <div className="text-xl font-bold">{route.duration} hrs</div>
                {route.timeSaved > 0 && (
                  <div className="text-xs text-green-500">
                    Saves {route.timeSaved} hrs
                  </div>
                )}
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-1">
                  <Banknote className="h-4 w-4 mr-1" />
                  <span className="text-xs">Total Cost</span>
                </div>
                <div className="text-xl font-bold">{formatCurrency(route.totalCost)}</div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center text-muted-foreground mb-1">
                  <Fuel className="h-4 w-4 mr-1" />
                  <span className="text-xs">Fuel</span>
                </div>
                <div className="text-xl font-bold">{route.fuelConsumption} L</div>
                {fuelPrice && (
                  <div className="text-xs text-muted-foreground">
                    @ ₹{fuelPrice.diesel_price}/L
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Safety Score</h4>
                <div className="flex items-center mb-1">
                  <Progress value={route.safetyScore} className="h-2" />
                  <span className="ml-2 text-sm">{route.safetyScore}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on road conditions, weather, and traffic
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Reliability Score</h4>
                <div className="flex items-center mb-1">
                  <Progress value={route.reliability} className="h-2" />
                  <span className="ml-2 text-sm">{route.reliability}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Likelihood of on-time arrival
                </p>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="key-info">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Key Route Information
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin:</span>
                      <span className="font-medium">{route.origin.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="font-medium">{route.destination.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weather:</span>
                      <div className="flex items-center">
                        {getWeatherIcon(route.weather)}
                        <span className="ml-1">{route.weather}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Traffic:</span>
                      <div className="flex items-center">
                        {getTrafficIcon(route.trafficConditions)}
                        <span className="ml-1 capitalize">{route.trafficConditions}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Road Conditions:</span>
                      <div className="flex items-center">
                        {getRoadConditionIcon(route.roadConditions)}
                        <span className="ml-1 capitalize">{route.roadConditions}</span>
                      </div>
                    </div>
                    {hasRestrictions && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Restrictions:</span>
                        <span className="text-amber-500 font-medium">{route.restrictions.length} restriction(s)</span>
                      </div>
                    )}
                    {route.permitsRequired.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Permits Required:</span>
                        <span className="text-amber-500 font-medium">{route.permitsRequired.join(', ')}</span>
                      </div>
                    )}
                    {fuelPrice && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fuel Rates:</span>
                        <span>Diesel: ₹{fuelPrice.diesel_price}/L in {fuelPrice.state}</span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="costs" className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 mr-2 text-red-500" />
                    <span>Fuel</span>
                  </div>
                  <div>
                    <span className="font-medium">{formatCurrency(route.estimatedCostBreakdown.fuel)}</span>
                    {fuelPrice && (
                      <div className="text-xs text-muted-foreground">
                        ₹{fuelPrice.diesel_price}/L × {route.fuelConsumption.toFixed(1)}L
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Landmark className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Tolls</span>
                  </div>
                  <span className="font-medium">{formatCurrency(route.estimatedCostBreakdown.tolls)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Maintenance</span>
                  </div>
                  <span className="font-medium">{formatCurrency(route.estimatedCostBreakdown.maintenance)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-green-500" />
                    <span>Labor</span>
                  </div>
                  <span className="font-medium">{formatCurrency(route.estimatedCostBreakdown.labor)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Receipt className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Other Expenses</span>
                  </div>
                  <span className="font-medium">{formatCurrency(route.estimatedCostBreakdown.other)}</span>
                </div>
                
                <div className="border-t pt-2 mt-2 flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(route.totalCost)}</span>
                </div>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tolls">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Landmark className="h-4 w-4 mr-2" />
                    Toll Details ({route.tolls.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {route.tolls.map((toll, index) => {
                      const tollPlaza = tollPlazas.find(p => p.id === toll.id);
                      
                      return (
                        <div key={toll.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                          <div>
                            <div className="font-medium">{toll.name}</div>
                            <div className="text-xs text-muted-foreground">{toll.location.name}</div>
                            {tollPlaza && (
                              <div className="flex items-center mt-1">
                                {tollPlaza.is_fastag_enabled && (
                                  <Badge variant="outline" className="text-xs px-1 py-0 border-green-500 text-green-600">
                                    FASTag
                                  </Badge>
                                )}
                                {tollPlaza.highway_name && (
                                  <span className="text-xs ml-1">{tollPlaza.highway_name}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(toll.cost)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="environmental">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 mr-2" />
                    Environmental Impact
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>CO₂ Emissions:</span>
                      <span className="font-medium">{route.emissions} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Savings vs Average:</span>
                      <span className="font-medium text-green-500">{emissionsSavingsPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Efficiency:</span>
                      <span className="font-medium">{(route.distance / route.fuelConsumption).toFixed(1)} km/L</span>
                    </div>
                    {fuelPrice && (
                      <div className="flex justify-between">
                        <span>Current Fuel Prices:</span>
                        <div className="text-right">
                          <div>Diesel: ₹{fuelPrice.diesel_price}</div>
                          <div>Petrol: ₹{fuelPrice.petrol_price}</div>
                          <div className="text-xs text-muted-foreground">
                            as of {formatDate(fuelPrice.effective_date)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="conditions" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex flex-col items-center justify-center h-full">
                  {getWeatherIcon(route.weather)}
                  <div className="mt-2 font-medium">{route.weather}</div>
                  <div className="text-xs text-muted-foreground">{route.weatherImpact !== 'none' ? 'Impact: ' + route.weatherImpact : 'No impact'}</div>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex flex-col items-center justify-center h-full">
                  {getTrafficIcon(route.trafficConditions)}
                  <div className="mt-2 font-medium capitalize">{route.trafficConditions}</div>
                  <div className="text-xs text-muted-foreground">Traffic Conditions</div>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex flex-col items-center justify-center h-full">
                  {getRoadConditionIcon(route.roadConditions)}
                  <div className="mt-2 font-medium capitalize">{route.roadConditions}</div>
                  <div className="text-xs text-muted-foreground">Road Conditions</div>
                </div>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {hasRestrictions && (
                <AccordionItem value="restrictions">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <AlertOctagon className="h-4 w-4 mr-2" />
                      Restrictions ({route.restrictions.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {route.restrictions.map((restriction, index) => (
                        <div key={index} className="border-b last:border-0 pb-2">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                            <span className="font-medium capitalize">{restriction.type} Restriction</span>
                          </div>
                          <div className="pl-6 text-sm">
                            <div>Limit: <span className="font-medium">{restriction.value}</span></div>
                            <div className="text-muted-foreground">{restriction.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {route.permitsRequired.length > 0 && (
                <AccordionItem value="permits">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Required Permits ({route.permitsRequired.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {route.permitsRequired.map((permit, index) => (
                        <div key={index} className="border-b last:border-0 pb-2">
                          <div className="font-medium">{permit}</div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="segments" className="space-y-4">
            <div className="text-sm">
              <p>This route consists of {route.segments.length} segments with {route.waypoints.length} waypoints including {restStops} rest stops and {route.tolls.length} toll plazas.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {route.segments.map((segment, index) => (
                <AccordionItem key={index} value={`segment-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {segment.startLocation.name} to {segment.endLocation.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-muted-foreground">Distance</div>
                          <div className="font-medium">{segment.distance} km</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Duration</div>
                          <div className="font-medium">{(segment.duration / 60).toFixed(1)} hrs</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Road Type</div>
                          <div className="font-medium">{segment.roadType || "Standard Road"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Road Quality</div>
                          <div className="font-medium capitalize">{segment.roadQuality || "Unknown"}</div>
                        </div>
                      </div>
                      
                      {segment.weather && segment.weather.condition && (
                        <div className="flex items-center">
                          <div className="text-muted-foreground mr-2">Weather:</div>
                          <div className="flex items-center">
                            {getWeatherIcon(segment.weather.condition)}
                            <span className="ml-1">{segment.weather.condition}</span>
                            {segment.weather.impact !== 'low' && (
                              <Badge className="ml-2" variant={segment.weather.impact === 'high' ? 'destructive' : 'default'}>
                                {segment.weather.impact} impact
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {segment.traffic && segment.traffic.congestionLevel && (
                        <div className="flex items-center">
                          <div className="text-muted-foreground mr-2">Traffic:</div>
                          <div className="flex items-center">
                            {getTrafficIcon(segment.traffic.congestionLevel)}
                            <span className="ml-1 capitalize">{segment.traffic.congestionLevel}</span>
                            {segment.traffic.delayMinutes > 0 && (
                              <Badge className="ml-2" variant="outline">
                                +{segment.traffic.delayMinutes} min delay
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {segment.restrictions && segment.restrictions.length > 0 && (
                        <div>
                          <div className="text-muted-foreground mb-1">Restrictions:</div>
                          <div className="pl-2 space-y-1">
                            {segment.restrictions.map((restriction, idx) => (
                              <div key={idx} className="flex items-start">
                                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                                <div>
                                  <div className="font-medium capitalize">{restriction.type} Restriction: {restriction.value}</div>
                                  <div className="text-xs text-muted-foreground">{restriction.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RouteDetails; 