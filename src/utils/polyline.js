import polyline from '@mapbox/polyline';

/**
 * Decodes a polyline string into an array of [lat, lng] coordinates.
 * 
 * @param {string} str - Encoded polyline string
 * @param {number} precision - Precision level (5 for Google Maps, 6 for OSRM)
 * @return {Array} - Array of [lat, lng] coordinates
 */
function decodePolyline(str, precision = 5) {
  if (!str || typeof str !== 'string') {
    console.error("Invalid polyline string:", str);
    return [];
  }
  
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates = [];
  const factor = Math.pow(10, precision);

  try {
    while (index < str.length) {
      let shift = 0;
      let result = 0;
      
      // Decode latitude
      do {
        let b = str.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (index < str.length && str.charCodeAt(index - 1) >= 0x20);
      
      const latitude = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += latitude;
      
      // Reset for longitude decoding
      shift = 0;
      result = 0;
      
      // Decode longitude
      do {
        let b = str.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (index < str.length && str.charCodeAt(index - 1) >= 0x20);
      
      const longitude = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += longitude;
      
      // Add coordinates in the correct order for Leaflet: [lat, lng]
      coordinates.push([lat / factor, lng / factor]);
    }
    
    return coordinates;
  } catch (error) {
    console.error("Error decoding polyline:", error);
    return [];
  }
}

/**
 * Convert decoded polyline coordinates to Leaflet LatLng objects
 * @param {Array<[number, number]>} decodedCoords - Array of [lat, lng] pairs
 * @returns {Array<{lat: number, lng: number}>} - Array of {lat, lng} objects
 */
export const toLeafletCoords = (decodedCoords) => {
  return decodedCoords.map(([lat, lng]) => ({ lat, lng }));
};

/**
 * Converts a polyline string to an array of Leaflet-compatible [lat, lng] points.
 * Handles different formats from various APIs.
 * 
 * @param {string|Object} input - Encoded polyline string or geometry object
 * @return {Array} - Array of [lat, lng] coordinates for Leaflet
 */
export const polylineToLeaflet = (input) => {
  // If input is null or undefined, return empty array
  if (!input) {
    console.error("Polyline input is null or undefined");
    return [];
  }
  
  try {
    // If input is a string, it's a direct encoded polyline
    if (typeof input === 'string') {
      return decodePolyline(input);
    }
    
    // If input has a 'points' property (like MapMyIndia), use that
    if (input.points) {
      return decodePolyline(input.points);
    }
    
    // If input has a 'polyline' property (like GraphHopper), use that
    if (input.polyline) {
      return decodePolyline(input.polyline);
    }
    
    // If input is an array of coordinates (like OSRM), convert to Leaflet format
    if (Array.isArray(input)) {
      // Check if it's an array of [lng, lat] pairs (OSRM format)
      if (input.length > 0 && Array.isArray(input[0]) && input[0].length === 2) {
        // Convert from [lng, lat] to [lat, lng] for Leaflet
        return input.map(coord => [coord[1], coord[0]]);
      }
      
      // If it's already in Leaflet format
      return input;
    }
    
    console.error("Unrecognized polyline format:", input);
    return [];
  } catch (error) {
    console.error("Error converting polyline to Leaflet format:", error);
    return [];
  }
};

/**
 * Encode an array of coordinates into a polyline string
 * @param {Array<{lat: number, lng: number}>} coords - Array of coordinate objects
 * @returns {string} - Encoded polyline string
 */
export const encodePolyline = (coords) => {
  if (!coords || !coords.length) return '';
  
  try {
    const formattedCoords = coords.map(coord => [coord.lat, coord.lng]);
    return polyline.encode(formattedCoords);
  } catch (error) {
    console.error('Error encoding polyline:', error);
    return '';
  }
};

// Export the decodePolyline function as well
export { decodePolyline };

export default {
  decodePolyline,
  toLeafletCoords,
  polylineToLeaflet,
  encodePolyline
}; 