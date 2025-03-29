import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';

interface MapProps {
  center?: {lat: number, lng: number};
  zoom?: number;
  waypoints?: Array<{
    lat: number;
    lng: number;
    label?: string;
    type?: string;
  }>;
  origin?: {
    lat: number;
    lng: number;
    label?: string;
  };
  destination?: {
    lat: number;
    lng: number;
    label?: string;
  };
  polyline?: string;
  showRoads?: boolean;
  showTraffic?: boolean;
  showWeather?: boolean;
  onClick?: (lat: number, lng: number) => void;
}

const Map: React.FC<MapProps> = ({
  center = {lat: 20.5937, lng: 78.9629}, // Center of India
  zoom = 5,
  waypoints = [],
  origin,
  destination,
  polyline,
  showRoads = true,
  showTraffic = false,
  showWeather = false,
  onClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Draw a map using HTML5 Canvas for a simplified solution that doesn't require API keys
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Size canvas to container
    const canvas = document.createElement('canvas');
    canvas.width = mapRef.current.clientWidth;
    canvas.height = mapRef.current.clientHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.borderRadius = '0.375rem';
    
    // Clear container and add canvas
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(canvas);
    
    // Get drawing context
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Background color - light gray
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw terrain patterns
    ctx.fillStyle = '#d1d5db';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 20 + Math.random() * 120;
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw grid lines for latitude/longitude
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 0.5;
    
    // Draw longitude lines
    for (let i = 0; i < 10; i++) {
      const x = (canvas.width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw latitude lines
    for (let i = 0; i < 10; i++) {
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw major roads if enabled
    if (showRoads) {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      
      // Draw some random major roads
      for (let i = 0; i < 5; i++) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
    
    // Function to convert lat/lng to x/y on canvas
    const latLngToXY = (lat: number, lng: number) => {
      // Simple linear transformation
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Scale factor based on zoom
      const scale = 20 * zoom;
      
      // Calculate offset from center
      const x = centerX + (lng - center.lng) * scale;
      const y = centerY - (lat - center.lat) * scale; // Flip y-axis
      
      return { x, y };
    };
    
    // Draw main route if origin and destination exist
    if (origin && destination) {
      // Get pixel coordinates
      const originPos = latLngToXY(origin.lat, origin.lng);
      const destPos = latLngToXY(destination.lat, destination.lng);
      
      // Draw route line
      ctx.strokeStyle = '#3b82f6'; // Blue
      ctx.lineWidth = 4;
      
      ctx.beginPath();
      ctx.moveTo(originPos.x, originPos.y);
      
      // If we have waypoints, create a curve through them
      if (waypoints.length > 0) {
        // For visual purposes, create control points
        const controlPoints = waypoints.map(wp => latLngToXY(wp.lat, wp.lng));
        
        // Simple bezier curve through control points
        let prevPoint = originPos;
        
        for (let i = 0; i < controlPoints.length; i++) {
          const point = controlPoints[i];
          const nextPoint = i < controlPoints.length - 1 
            ? controlPoints[i + 1] 
            : destPos;
          
          // Simple quadratic curve
          const cpX = (prevPoint.x + point.x + nextPoint.x) / 3;
          const cpY = (prevPoint.y + point.y + nextPoint.y) / 3;
          
          ctx.quadraticCurveTo(cpX, cpY, point.x, point.y);
          prevPoint = point;
        }
        
        // Final curve to destination
        ctx.quadraticCurveTo(
          (prevPoint.x + destPos.x) / 2,
          (prevPoint.y + destPos.y) / 2,
          destPos.x,
          destPos.y
        );
      } else {
        // Straight line if no waypoints
        ctx.lineTo(destPos.x, destPos.y);
      }
      
      ctx.stroke();
      
      // Draw origin marker
      ctx.fillStyle = '#22c55e'; // Green
      ctx.beginPath();
      ctx.arc(originPos.x, originPos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('A', originPos.x, originPos.y);
      
      // Draw destination marker
      ctx.fillStyle = '#ef4444'; // Red
      ctx.beginPath();
      ctx.arc(destPos.x, destPos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText('B', destPos.x, destPos.y);
      
      // Draw waypoints
      ctx.fillStyle = '#6366f1'; // Indigo
      waypoints.forEach((wp, index) => {
        const pos = latLngToXY(wp.lat, wp.lng);
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        if (wp.label) {
          ctx.fillStyle = '#000000';
          ctx.font = '10px sans-serif';
          ctx.fillText(wp.label, pos.x, pos.y - 10);
          ctx.fillStyle = '#6366f1';
        }
      });
    }
    
    // Add traffic indicators if enabled
    if (showTraffic) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 30 + Math.random() * 60;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add weather indicators if enabled
    if (showWeather) {
      ctx.fillStyle = 'rgba(0, 100, 255, 0.2)';
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 80 + Math.random() * 120;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add click handler
    if (onClick) {
      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Transform screen coordinates back to lat/lng
        // This is a simplified inverse of latLngToXY
        const scale = 20 * zoom;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const lng = center.lng + (x - centerX) / scale;
        const lat = center.lat - (y - centerY) / scale;
        
        onClick(lat, lng);
      });
    }
  }, [center, zoom, waypoints, origin, destination, showRoads, showTraffic, showWeather, onClick, polyline]);
  
  return (
    <div className="h-full w-full relative">
      <div ref={mapRef} className="h-full w-full rounded-md" />
      
      {/* Map type selectors */}
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        <Badge variant="outline" className="bg-white dark:bg-slate-800">
          {showRoads ? 'Roads: On' : 'Roads: Off'}
        </Badge>
        <Badge variant={showTraffic ? "secondary" : "outline"} className={showTraffic ? "" : "bg-white dark:bg-slate-800"}>
          Traffic
        </Badge>
        <Badge variant={showWeather ? "secondary" : "outline"} className={showWeather ? "" : "bg-white dark:bg-slate-800"}>
          Weather
        </Badge>
      </div>
    </div>
  );
};

export default Map;
