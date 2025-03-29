
import React, { useEffect, useRef } from 'react';

interface MapProps {
  start: string;
  destination: string;
  selectedRoute: any;
}

const Map = ({ start, destination, selectedRoute }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // In a real implementation, we would integrate with Google Maps API
    // For this prototype, we'll just render a placeholder map with a canvas
    if (mapRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = mapRef.current.clientWidth;
      canvas.height = mapRef.current.clientHeight;
      
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw a simple map placeholder
        ctx.fillStyle = '#f0f4f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines
        ctx.strokeStyle = '#d1dce8';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        // Vertical grid lines
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // If there's a selected route, draw start/end points and route
        if (selectedRoute) {
          // Start point (green circle)
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(50, canvas.height / 2, 10, 0, Math.PI * 2);
          ctx.fill();
          
          // End point (red circle)
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(canvas.width - 50, canvas.height / 2, 10, 0, Math.PI * 2);
          ctx.fill();
          
          // Route line
          ctx.strokeStyle = selectedRoute.isRecommended ? '#10b981' : '#3b82f6';
          ctx.lineWidth = 4;
          ctx.beginPath();
          
          // Create a curved path to simulate a route
          ctx.moveTo(50, canvas.height / 2);
          
          // Route with some random curves to make it look more realistic
          const midX = canvas.width / 2;
          const offset = Math.random() * 50 + 30;
          const midY = canvas.height / 2 + (Math.random() > 0.5 ? offset : -offset);
          
          ctx.quadraticCurveTo(midX, midY, canvas.width - 50, canvas.height / 2);
          ctx.stroke();
          
          // Add toll markers
          if (selectedRoute.tolls) {
            ctx.fillStyle = '#f97316';
            selectedRoute.tolls.forEach((toll, i) => {
              const x = 100 + ((canvas.width - 200) / (selectedRoute.tolls.length + 1)) * (i + 1);
              const y = canvas.height / 2 + (Math.random() > 0.5 ? 20 : -20);
              
              ctx.beginPath();
              ctx.arc(x, y, 6, 0, Math.PI * 2);
              ctx.fill();
            });
          }
          
          // Labels for start and end
          ctx.fillStyle = '#000000';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(start, 50, canvas.height / 2 - 20);
          ctx.fillText(destination, canvas.width - 50, canvas.height / 2 - 20);
        }
      }
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [start, destination, selectedRoute]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-md overflow-hidden border shadow-sm"
      style={{ minHeight: '500px' }}
    >
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
};

export default Map;
