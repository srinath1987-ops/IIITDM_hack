// Mock traffic data for the Chennai-Mumbai route
export const mockTrafficData = {
  timestamp: new Date().toISOString(),
  incidents: [
    {
      id: "traffic-1",
      type: "congestion",
      severity: "high",
      lat: 13.1287,
      lng: 77.5878,
      description: "Heavy traffic due to road construction near Bangalore",
      speedKmph: 15,
      delayMinutes: 25,
      roadName: "NH 44",
      direction: "Northbound",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      estimatedEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() // 5 hours from now
    },
    {
      id: "traffic-2",
      type: "congestion",
      severity: "medium",
      lat: 18.5204,
      lng: 73.8567,
      description: "Slow-moving traffic on Pune bypass",
      speedKmph: 30,
      delayMinutes: 15,
      roadName: "Pune Bypass",
      direction: "Westbound",
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      estimatedEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
    },
    {
      id: "traffic-3",
      type: "accident",
      severity: "high",
      lat: 16.4978,
      lng: 80.6544,
      description: "Multi-vehicle accident, 2 lanes blocked",
      speedKmph: 10,
      delayMinutes: 40,
      roadName: "NH 16",
      direction: "Northbound",
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      estimatedEndTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() // 3 hours from now
    },
    {
      id: "traffic-4",
      type: "roadwork",
      severity: "medium",
      lat: 17.3616,
      lng: 78.4747,
      description: "Ongoing road maintenance, 1 lane closed",
      speedKmph: 35,
      delayMinutes: 20,
      roadName: "Hyderabad Ring Road",
      direction: "Clockwise",
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      estimatedEndTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString() // 36 hours from now
    },
    {
      id: "traffic-5",
      type: "congestion",
      severity: "low",
      lat: 19.0760,
      lng: 72.8777,
      description: "Slow traffic approaching Mumbai",
      speedKmph: 40,
      delayMinutes: 10,
      roadName: "Eastern Express Highway",
      direction: "Southbound",
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      estimatedEndTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString() // 2.5 hours from now
    }
  ],
  trafficFlowSegments: [
    {
      id: "flow-1",
      startLat: 13.0827,
      startLng: 80.2707,
      endLat: 13.9825,
      endLng: 78.1453,
      speedKmph: 75,
      congestionLevel: "moderate",
      roadName: "NH 44",
      length: 186.5 // km
    },
    {
      id: "flow-2",
      startLat: 13.9825,
      startLng: 78.1453,
      endLat: 15.3173,
      endLng: 76.4607,
      speedKmph: 85,
      congestionLevel: "low",
      roadName: "NH 44",
      length: 255.3 // km
    },
    {
      id: "flow-3",
      startLat: 15.3173,
      startLng: 76.4607,
      endLat: 17.3850,
      endLng: 74.3802,
      speedKmph: 65,
      congestionLevel: "moderate",
      roadName: "NH 48",
      length: 320.7 // km
    },
    {
      id: "flow-4",
      startLat: 17.3850,
      startLng: 74.3802,
      endLat: 18.5204,
      endLng: 73.8567,
      speedKmph: 70,
      congestionLevel: "moderate",
      roadName: "NH 48",
      length: 240.2 // km
    },
    {
      id: "flow-5",
      startLat: 18.5204,
      startLng: 73.8567,
      endLat: 19.0760,
      endLng: 72.8777,
      speedKmph: 55,
      congestionLevel: "high",
      roadName: "Mumbai-Pune Expressway",
      length: 148.3 // km
    }
  ]
}; 