import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

export type Location = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state?: string;
  address?: string;
};

export type TollInfo = {
  id: string;
  name: string;
  cost: number;
  location: Location;
  isFastagEnabled: boolean;
};

export type WeatherInfo = {
  condition: string;
  impact: 'none' | 'low' | 'medium' | 'high';
  description?: string;
  temperature?: number;
};

export type TrafficInfo = {
  congestionLevel: 'light' | 'medium' | 'high';
  delayMinutes: number;
  description?: string;
};

export type Restriction = {
  id: string;
  type: 'weight' | 'height' | 'width' | 'length' | 'time' | 'other';
  value: string;
  description: string;
  location?: Location;
};

export type Waypoint = {
  id: string;
  name: string;
  type: 'toll' | 'rest' | 'restriction';
  latitude: number;
  longitude: number;
  details?: string;
};

export type RouteSegmentInfo = {
  startLocation: Location;
  endLocation: Location;
  distance: number;
  duration: number;
  roadType: string;
  roadQuality?: 'poor' | 'average' | 'good';
  weather?: WeatherInfo;
  traffic?: TrafficInfo;
  restrictions?: Restriction[];
};

export type CostBreakdown = {
  fuel: number;
  tolls: number;
  maintenance: number;
  labor: number;
  other: number;
};

export type RouteOptimizationResponse = {
  id: string;
  name: string;
  distance: number;
  duration: number;
  totalCost: number;
  estimatedCostBreakdown: CostBreakdown;
  fuelConsumption: number;
  emissions: number;
  safetyScore: number;
  reliability: number;
  origin: Location;
  destination: Location;
  waypoints: Waypoint[];
  segments: RouteSegmentInfo[];
  tolls: TollInfo[];
  weather: string;
  weatherImpact: 'none' | 'low' | 'medium' | 'high';
  trafficConditions: 'light' | 'moderate' | 'heavy';
  roadConditions: 'poor' | 'average' | 'good';
  isRecommended: boolean;
  timeSaved: number;
  restrictions: Restriction[];
  permitsRequired: string[];
  polyline: string;
};

export type RouteOptimizationRequest = {
  origin: string | Location;
  destination: string | Location;
  vehicleType: string;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  goodsType?: string;
  preferences?: {
    prioritizeSafety?: boolean;
    prioritizeSpeed?: boolean;
    prioritizeCost?: boolean;
    avoidTolls?: boolean;
    avoidHighways?: boolean;
  };
};

export async function optimizeRoute(
  request: RouteOptimizationRequest
): Promise<RouteOptimizationResponse[]> {
  try {
    // In a real implementation, this would call a real AI service or API
    // For now, we'll simulate the response with mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock route option
    const mainRoute = generateMockRoute(request, true);
    
    // Generate 2-3 alternative routes with slight variations
    const alternatives = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => 
      generateMockRoute(request, false)
    );
    
    return [mainRoute, ...alternatives];
  } catch (error) {
    console.error("Error optimizing route:", error);
    throw new Error("Failed to optimize route");
  }
}

function generateMockRoute(
  request: RouteOptimizationRequest,
  isRecommended: boolean
): RouteOptimizationResponse {
  // Get origin and destination
  const origin = typeof request.origin === 'string' 
    ? { id: 'origin-1', name: request.origin, latitude: 19.0760, longitude: 72.8777 } 
    : request.origin;
    
  const destination = typeof request.destination === 'string' 
    ? { id: 'dest-1', name: request.destination, latitude: 18.5204, longitude: 73.8567 } 
    : request.destination;
  
  // Base distance between cities (in kilometers)
  const baseDistance = 150 + Math.random() * 40;
  
  // Generate variation for this route
  const variationFactor = isRecommended ? 1 : 1 + (Math.random() * 0.3);
  
  // Calculate route metrics with variation
  const distance = Math.round(baseDistance * variationFactor);
  const duration = Math.round((distance / 55) * 10) / 10; // Average speed 55 km/h
  const fuelConsumption = Math.round(distance * (0.08 + Math.random() * 0.04) * 10) / 10;
  const tolls = generateMockTolls(3 + Math.floor(Math.random() * 3));
  const totalTollCost = tolls.reduce((sum, toll) => sum + toll.cost, 0);
  
  // Generate waypoints
  const waypoints = [
    ...tolls.map(toll => ({
      id: `wp-toll-${toll.id}`,
      name: toll.name,
      type: 'toll' as const,
      latitude: toll.location.latitude,
      longitude: toll.location.longitude,
      details: `Toll cost: ₹${toll.cost}`
    })),
    ...generateMockRestStops(1 + Math.floor(Math.random() * 2))
  ];
  
  // Generate restrictions
  const restrictions = Math.random() > 0.7 ? [
    {
      id: `restr-${Math.random().toString(36).substring(7)}`,
      type: Math.random() > 0.5 ? 'weight' : 'height',
      value: Math.random() > 0.5 ? '10 tons' : '4.5 meters',
      description: 'Restriction on bridge'
    }
  ] : [];
  
  if (restrictions.length > 0) {
    waypoints.push({
      id: `wp-restr-${restrictions[0].id}`,
      name: 'Restriction Point',
      type: 'restriction' as const,
      latitude: origin.latitude + ((destination.latitude - origin.latitude) * 0.6),
      longitude: origin.longitude + ((destination.longitude - origin.longitude) * 0.6),
      details: `${restrictions[0].type} restriction: ${restrictions[0].value}`
    });
  }
  
  // Weather conditions
  const weatherOptions = ['Clear', 'Rain', 'Fog'];
  const weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  const weatherImpact = weather === 'Clear' ? 'none' : 
                       weather === 'Rain' ? 'medium' : 'high';
  
  // Traffic conditions
  const trafficOptions = ['light', 'moderate', 'heavy'];
  const trafficWeights = isRecommended ? [0.6, 0.3, 0.1] : [0.3, 0.4, 0.3]; // Biased toward better traffic for recommended routes
  
  const trafficConditions = weightedRandomChoice(trafficOptions, trafficWeights);
  
  // Road conditions
  const roadOptions = ['good', 'average', 'poor'];
  const roadWeights = isRecommended ? [0.7, 0.25, 0.05] : [0.3, 0.5, 0.2]; // Biased toward better roads for recommended routes
  
  const roadConditions = weightedRandomChoice(roadOptions, roadWeights);
  
  // Calculate costs
  const fuelCost = fuelConsumption * 100; // Assuming ₹100 per liter
  const maintenanceCost = distance * 2;
  const laborCost = duration * 300; // Driver cost per hour
  const otherCosts = distance * 1.5;
  
  const totalCost = Math.round(fuelCost + totalTollCost + maintenanceCost + laborCost + otherCosts);
  
  // Environmental impact
  const emissions = Math.round(fuelConsumption * 2.5 * 10) / 10; // kg CO2
  
  // Safety and reliability scores
  const safetyScoreBase = 75;
  const safetyImpacts = {
    weather: weather === 'Clear' ? 0 : weather === 'Rain' ? -5 : -15,
    traffic: trafficConditions === 'light' ? 0 : trafficConditions === 'moderate' ? -3 : -8,
    roads: roadConditions === 'good' ? 0 : roadConditions === 'average' ? -5 : -12
  };
  
  const reliabilityBase = 80;
  const reliabilityImpacts = {
    weather: weather === 'Clear' ? 0 : weather === 'Rain' ? -3 : -10,
    traffic: trafficConditions === 'light' ? 0 : trafficConditions === 'moderate' ? -5 : -15,
    roads: roadConditions === 'good' ? 0 : roadConditions === 'average' ? -3 : -8
  };
  
  const safetyScore = Math.min(100, Math.max(25, 
    safetyScoreBase + safetyImpacts.weather + safetyImpacts.traffic + safetyImpacts.roads + 
    (isRecommended ? 8 : 0)
  ));
  
  const reliability = Math.min(100, Math.max(25, 
    reliabilityBase + reliabilityImpacts.weather + reliabilityImpacts.traffic + reliabilityImpacts.roads + 
    (isRecommended ? 10 : 0)
  ));
  
  // Generate route segments
  const segments = generateRouteSegments(origin, destination, waypoints, distance, duration);
  
  // Generate a fake polyline for the map
  const polyline = generateFakePolyline(origin, destination, waypoints);
  
  // For recommended routes, calculate time saved compared to average
  const timeSaved = isRecommended ? Math.round((baseDistance * 1.15 / 50 - duration) * 10) / 10 : 0;
  
  // Permits required
  const permitsRequired = request.weight > 20 || (request.dimensions && request.dimensions.height > 4.5) 
    ? ['Oversize Load Permit'] : [];
  
  return {
    id: `route-${Math.random().toString(36).substring(7)}`,
    name: `Route ${isRecommended ? 'A (Recommended)' : destination.name}`,
    distance,
    duration,
    totalCost,
    estimatedCostBreakdown: {
      fuel: Math.round(fuelCost),
      tolls: Math.round(totalTollCost),
      maintenance: Math.round(maintenanceCost),
      labor: Math.round(laborCost),
      other: Math.round(otherCosts)
    },
    fuelConsumption,
    emissions,
    safetyScore,
    reliability,
    origin,
    destination,
    waypoints,
    segments,
    tolls,
    weather,
    weatherImpact,
    trafficConditions,
    roadConditions,
    isRecommended,
    timeSaved,
    restrictions,
    permitsRequired,
    polyline
  };
}

function generateMockTolls(count: number): TollInfo[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `toll-${Math.random().toString(36).substring(7)}`;
    return {
      id,
      name: `Toll Plaza ${index + 1}`,
      cost: Math.round(50 + Math.random() * 150),
      location: {
        id: `loc-${id}`,
        name: `Highway Toll ${index + 1}`,
        latitude: 19.0760 - (0.5 * Math.random()),
        longitude: 72.8777 + (0.5 * Math.random())
      },
      isFastagEnabled: Math.random() > 0.2
    };
  });
}

function generateMockRestStops(count: number): Waypoint[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `rest-${Math.random().toString(36).substring(7)}`;
    return {
      id,
      name: `Rest Area ${index + 1}`,
      type: 'rest',
      latitude: 19.0760 - (0.6 * Math.random()),
      longitude: 72.8777 + (0.6 * Math.random()),
      details: 'Facilities: Food, Restrooms, Parking'
    };
  });
}

function generateRouteSegments(
  origin: Location,
  destination: Location,
  waypoints: Waypoint[],
  totalDistance: number,
  totalDuration: number
): RouteSegmentInfo[] {
  // Create an array of all points in order (origin, waypoints, destination)
  const allPoints = [
    { point: origin, type: 'origin' },
    ...waypoints.map(wp => ({ 
      point: { 
        id: `loc-wp-${wp.id}`, 
        name: wp.name, 
        latitude: wp.latitude, 
        longitude: wp.longitude
      }, 
      type: wp.type 
    })),
    { point: destination, type: 'destination' }
  ];
  
  // Sort points to create a reasonable route
  // This is a simplistic approach - in a real system, these would be properly ordered
  allPoints.sort((a, b) => {
    if (a.type === 'origin') return -1;
    if (b.type === 'origin') return 1;
    if (a.type === 'destination') return 1;
    if (b.type === 'destination') return -1;
    return 0;
  });
  
  // Create segments between consecutive points
  const segments: RouteSegmentInfo[] = [];
  let remainingDistance = totalDistance;
  let remainingDuration = totalDuration * 60; // Convert to minutes
  
  for (let i = 0; i < allPoints.length - 1; i++) {
    const start = allPoints[i].point;
    const end = allPoints[i + 1].point;
    
    // Calculate segment fraction (simplified approach)
    const segmentFraction = 1 / (allPoints.length - 1);
    
    // Allocate distance and duration for this segment
    const segmentDistance = i < allPoints.length - 2 
      ? Math.round((totalDistance * segmentFraction) * 10) / 10
      : remainingDistance;
      
    const segmentDuration = i < allPoints.length - 2
      ? Math.round((totalDuration * 60 * segmentFraction) * 10) / 10
      : remainingDuration;
    
    remainingDistance = Math.max(0, remainingDistance - segmentDistance);
    remainingDuration = Math.max(0, remainingDuration - segmentDuration);
    
    // Road type varies by segment
    const roadTypes = ['National Highway', 'State Highway', 'Rural Road', 'Urban Road'];
    const roadTypeWeights = [0.6, 0.25, 0.1, 0.05];
    const roadType = weightedRandomChoice(roadTypes, roadTypeWeights);
    
    // Road quality depends on road type
    const roadQualityByType: Record<string, ('poor' | 'average' | 'good')[]> = {
      'National Highway': ['good', 'good', 'average'],
      'State Highway': ['good', 'average', 'average'],
      'Rural Road': ['average', 'poor', 'poor'],
      'Urban Road': ['good', 'average', 'average']
    };
    
    const roadQuality = roadQualityByType[roadType][Math.floor(Math.random() * 3)] as 'poor' | 'average' | 'good';
    
    // Weather and traffic can vary by segment
    const weatherConditions = ['Clear', 'Rain', 'Fog'];
    const weatherProbs = [0.7, 0.2, 0.1];
    const segmentWeather = {
      condition: weightedRandomChoice(weatherConditions, weatherProbs),
      impact: 'low' as const
    };
    
    if (segmentWeather.condition !== 'Clear') {
      segmentWeather.impact = Math.random() > 0.7 ? 'high' : 'medium';
    }
    
    const trafficLevels = ['light', 'medium', 'high'];
    const trafficProbs = [0.5, 0.3, 0.2];
    const segmentTraffic = {
      congestionLevel: weightedRandomChoice(trafficLevels, trafficProbs) as 'light' | 'medium' | 'high',
      delayMinutes: 0
    };
    
    if (segmentTraffic.congestionLevel === 'medium') {
      segmentTraffic.delayMinutes = Math.round(Math.random() * 10);
    } else if (segmentTraffic.congestionLevel === 'high') {
      segmentTraffic.delayMinutes = Math.round(10 + Math.random() * 20);
    }
    
    // Generate restrictions for this segment
    const segmentRestrictions: Restriction[] = [];
    
    // Add a segment restriction with 20% chance
    if (Math.random() < 0.2) {
      const restrictionTypes = ['weight', 'height', 'width', 'length', 'time'];
      const type = restrictionTypes[Math.floor(Math.random() * restrictionTypes.length)] as Restriction['type'];
      
      let value = '';
      let description = '';
      
      switch (type) {
        case 'weight':
          value = `${Math.floor(10 + Math.random() * 15)} tons`;
          description = 'Weight restriction due to bridge capacity';
          break;
        case 'height':
          value = `${Math.floor(3 + Math.random() * 3)}.${Math.floor(Math.random() * 10)} meters`;
          description = 'Height restriction due to overpass';
          break;
        case 'width':
          value = `${Math.floor(2 + Math.random() * 2)}.${Math.floor(Math.random() * 10)} meters`;
          description = 'Width restriction on narrow road';
          break;
        case 'length':
          value = `${Math.floor(10 + Math.random() * 10)} meters`;
          description = 'Length restriction for vehicles';
          break;
        case 'time':
          value = '10:00 PM - 6:00 AM';
          description = 'Time restriction for heavy vehicles';
          break;
        default:
          value = 'Restricted';
          description = 'Special restriction applies';
      }
      
      segmentRestrictions.push({
        id: `restr-${Math.random().toString(36).substring(7)}`,
        type,
        value,
        description
      });
    }
    
    segments.push({
      startLocation: start,
      endLocation: end,
      distance: segmentDistance,
      duration: segmentDuration,
      roadType,
      roadQuality,
      weather: segmentWeather,
      traffic: segmentTraffic,
      restrictions: segmentRestrictions
    });
  }
  
  return segments;
}

function weightedRandomChoice<T>(options: T[], weights: number[]): T {
  // Normalize weights if they don't sum to 1
  const sum = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map(w => w / sum);
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < options.length; i++) {
    cumulativeWeight += normalizedWeights[i];
    if (random <= cumulativeWeight) {
      return options[i];
    }
  }
  
  // Default to last option if something goes wrong
  return options[options.length - 1];
}

function generateFakePolyline(
  origin: Location,
  destination: Location,
  waypoints: Waypoint[]
): string {
  // This is a simplified version - in a real app, this would be a proper polyline
  // For our demo purposes, we'll just return a placeholder string
  return "mockencodedpolyline";
}

export async function invalidateRouteCache(queryClient: QueryClient) {
  await queryClient.invalidateQueries({ queryKey: ['routes'] });
}
