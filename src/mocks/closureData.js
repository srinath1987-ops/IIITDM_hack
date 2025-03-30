// Mock road closure data for the Chennai-Mumbai routes
export const mockClosures = [
  {
    id: "closure-1",
    lat: 14.7021,
    lng: 77.5946,
    reason: "Bridge maintenance work",
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: "active",
    detourAvailable: true,
    detourDelay: 25, // minutes
    roadName: "NH 44",
    direction: "Both",
    affectedSegments: ["Chennai-Bangalore"],
    source: "NHAI"
  },
  {
    id: "closure-2",
    lat: 16.8302,
    lng: 74.6894,
    reason: "Landslide after heavy rain",
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    status: "active",
    detourAvailable: true,
    detourDelay: 40, // minutes
    roadName: "NH 48",
    direction: "Both",
    affectedSegments: ["Kolhapur-Belgaum"],
    source: "Local Police"
  },
  {
    id: "closure-3",
    lat: 18.9389,
    lng: 73.3361,
    reason: "Road resurfacing",
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: "active",
    detourAvailable: true,
    detourDelay: 15, // minutes
    roadName: "Mumbai-Pune Expressway",
    direction: "Eastbound",
    affectedSegments: ["Mumbai-Pune"],
    source: "MSRDC"
  },
  {
    id: "closure-4",
    lat: 17.2546,
    lng: 78.6808,
    reason: "Construction of flyover",
    startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    status: "active",
    detourAvailable: true,
    detourDelay: 35, // minutes
    roadName: "Hyderabad Outer Ring Road",
    direction: "Both",
    affectedSegments: ["Hyderabad Bypass"],
    source: "HMDA"
  },
  {
    id: "closure-5",
    lat: 19.9975,
    lng: 73.7898,
    reason: "Tunnel inspection after earthquake",
    startTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    endTime: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(), // 16 hours from now
    status: "active",
    detourAvailable: false,
    detourDelay: 90, // minutes
    roadName: "NH 160",
    direction: "Both",
    affectedSegments: ["Nashik-Mumbai"],
    source: "Traffic Police"
  },
  {
    id: "closure-6",
    lat: 14.4630,
    lng: 79.9865,
    reason: "Flooding due to heavy monsoon",
    startTime: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    status: "active",
    detourAvailable: true,
    detourDelay: 60, // minutes
    roadName: "NH 16",
    direction: "Both",
    affectedSegments: ["Chennai-Visakhapatnam"],
    source: "Disaster Management"
  },
  {
    id: "closure-7",
    lat: 15.8281,
    lng: 74.4977,
    reason: "Vehicle breakdown - multi-axle truck",
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    status: "active",
    detourAvailable: true,
    detourDelay: 10, // minutes
    roadName: "NH 48",
    direction: "Southbound",
    affectedSegments: ["Dharwad-Belgaum"],
    source: "Highway Patrol"
  }
]; 