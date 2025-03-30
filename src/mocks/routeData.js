// Mock data for routes between Chennai and Mumbai
export const mockRoutes = [
  {
    // Main route via Bangalore and Pune
    routeId: "route-1",
    distance: 1348.7, // in km
    duration: 21.5 * 60 * 60, // 21 hours 30 minutes in seconds
    geometry: "_fhwM{qitMcI_AwHuDiKiEgHeEgCaSeB{OkBeKuFuKoJ{LoNiLaNeMgL_JqI_KaIwP{J_RuHuKsIgEeLoFwLiKeHsP{HoTwHuUsEkNqIaM{MyL{MiJyH{GqEuIoAoM~@_OlCoNlEwOxCmQn@yLuCoKuGcIuGeHkGqD{IqBgJaE_FoJ_AwHmAcJuGmHeIeHcJkGyJaL_MqKoNcLcLaFgGkAuIsA{TkEcT{G_K{I}DyKm@uJ", // Encoded polyline
    bbox: [72.88, 12.97, 80.27, 19.08], // [minLng, minLat, maxLng, maxLat]
    tollCost: 1250, // in INR
    fuelCost: 7500, // estimated fuel cost
    trafficDelay: 45 * 60, // 45 minutes delay due to traffic
    restrictions: ["height: 4.5m", "weight: 40t"],
    // Key segments along the route
    segments: [
      { start: "Chennai", end: "Bangalore", distance: 346.2, duration: 5.8 * 60 * 60 },
      { start: "Bangalore", end: "Hubli", distance: 392.5, duration: 6.3 * 60 * 60 },
      { start: "Hubli", end: "Pune", distance: 429.8, duration: 6.9 * 60 * 60 },
      { start: "Pune", end: "Mumbai", distance: 180.2, duration: 2.5 * 60 * 60 }
    ],
    // Toll points along the route
    tollPoints: [
      { lat: 13.2245, lng: 77.5946, name: "Devanahalli Toll Plaza", cost: 145, currency: "INR" },
      { lat: 14.2339, lng: 76.3955, name: "Chitradurga Toll Plaza", cost: 205, currency: "INR" },
      { lat: 15.8519, lng: 74.4977, name: "Dharwad Toll Plaza", cost: 180, currency: "INR" },
      { lat: 17.2701, lng: 74.1855, name: "Karad Toll Plaza", cost: 225, currency: "INR" },
      { lat: 18.4201, lng: 73.8567, name: "Khed-Shivapur Toll Plaza", cost: 195, currency: "INR" },
      { lat: 19.0337, lng: 73.0724, name: "Vashi Toll Plaza", cost: 300, currency: "INR" }
    ]
  },
  {
    // Alternate route via Hyderabad and Nagpur
    routeId: "route-2",
    distance: 1567.3, // in km
    duration: 24.2 * 60 * 60, // 24 hours 12 minutes in seconds
    geometry: "_fhwM{qitMuIwAaQwDoMiJaFwLoD{LuF{J{IgHsMqHqLoDaQmAoPqEiKwJ_FmMuAiLyEgIwKoFePgEqL{EeJyGaG}JqFaIoKkCoN_B}LiC_KwHmG{KiDkL}FaI{K}EmL}IiHaM{E{NsD}KcHaIeKoF{MiEmMoDeLsF_K_JeHkMgF_NsEmK{GiJuIaHyJyGqJ{H_ImL}FgMsFqJaHiIyJeG_MqE{M}C_NyAgMw@}OlAeNeE{HqJoDcL{GoI_JgGcK}EyKwD}KeB_La@_MlA_JxD{HxGkI", // Encoded polyline
    bbox: [72.88, 12.97, 81.72, 21.15], // [minLng, minLat, maxLng, maxLat]
    tollCost: 1050, // in INR
    fuelCost: 8700, // estimated fuel cost
    trafficDelay: 30 * 60, // 30 minutes delay due to traffic
    restrictions: ["height: 4.5m", "weight: 40t"],
    segments: [
      { start: "Chennai", end: "Hyderabad", distance: 635.7, duration: 9.6 * 60 * 60 },
      { start: "Hyderabad", end: "Nagpur", distance: 501.2, duration: 7.8 * 60 * 60 },
      { start: "Nagpur", end: "Aurangabad", distance: 246.1, duration: 3.9 * 60 * 60 },
      { start: "Aurangabad", end: "Mumbai", distance: 184.3, duration: 2.9 * 60 * 60 }
    ],
    tollPoints: [
      { lat: 14.8528, lng: 79.9825, name: "Nellore Toll Plaza", cost: 125, currency: "INR" },
      { lat: 16.7536, lng: 80.0937, name: "Vijayawada Toll Plaza", cost: 195, currency: "INR" },
      { lat: 18.3829, lng: 79.8713, name: "Hyderabad Outer Ring Road", cost: 165, currency: "INR" },
      { lat: 20.2354, lng: 79.1783, name: "Nagpur Highway Toll", cost: 210, currency: "INR" },
      { lat: 19.8531, lng: 75.4152, name: "Aurangabad Toll Plaza", cost: 155, currency: "INR" },
      { lat: 19.2183, lng: 73.1468, name: "Thane Toll Plaza", cost: 200, currency: "INR" }
    ]
  },
  {
    // Third route via coastal road
    routeId: "route-3",
    distance: 1380.5, // in km
    duration: 22.8 * 60 * 60, // 22 hours 48 minutes in seconds
    geometry: "_fhwM{qitMsCwA}IsGkIaLgEoM_BuNhAiNjEiLnH}JpKqHnMaGlN{EvO_DiPsBmQ}@uR@sSvBgRzEmQrHuNtKeL|NgIxPgFxQuD~S_B|Td@vTjCbSrFtQpHtOzKhNjMzL|OrKzQtJzRtJlTzGbVvFjWzCbXhB~X@`YuAxXsEjW_I|UmLnTwMtT{N~S}OjSqP~QgP`SeOlTsNzUkMxWwLrXkLpYuKp[mKz[cKt\\aKv\\oKr[kL|YyMzXoN~VoOzUqPxTyQnS_ShRiTjQmU`P{V`OiXjM{YjLo[vJg]fI}]lHc^`Hi^lGi^dGw]fHe]xI}\\vKy[~M{[bOaZ~Qa[bS]ZrV]Z~W_XbXeU~UmT~SyRdRmRfQaSrQcT|QwS`SeR|TaQhWqPz\\aP`]gQdZqR`WaSfU{QbV}PrX_QlZ_RpXgSzVoTdUwUrT_WhTwWpTcYzRi[", // Encoded polyline
    bbox: [72.82, 12.97, 80.27, 19.23], // [minLng, minLat, maxLng, maxLat]
    tollCost: 950, // in INR
    fuelCost: 8100, // estimated fuel cost
    trafficDelay: 75 * 60, // 1 hour 15 minutes delay due to traffic
    restrictions: ["height: 4.5m", "weight: 40t"],
    segments: [
      { start: "Chennai", end: "Ongole", distance: 312.3, duration: 5.1 * 60 * 60 },
      { start: "Ongole", end: "Vijayawada", distance: 162.5, duration: 2.6 * 60 * 60 },
      { start: "Vijayawada", end: "Vishakhapatnam", distance: 384.7, duration: 6.3 * 60 * 60 },
      { start: "Vishakhapatnam", end: "Bhubaneswar", distance: 441.2, duration: 7.2 * 60 * 60 },
      { start: "Bhubaneswar", end: "Mumbai", distance: 79.8, duration: 1.6 * 60 * 60 }
    ],
    tollPoints: [
      { lat: 14.4546, lng: 80.0326, name: "Ongole Toll Plaza", cost: 130, currency: "INR" },
      { lat: 16.5237, lng: 80.6305, name: "Vijayawada Bypass", cost: 110, currency: "INR" },
      { lat: 17.7215, lng: 83.2508, name: "Vishakhapatnam Toll", cost: 185, currency: "INR" },
      { lat: 19.1253, lng: 73.0235, name: "Mumbai Entry Toll", cost: 525, currency: "INR" }
    ]
  }
]; 