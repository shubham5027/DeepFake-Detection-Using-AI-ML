
import { useRef, useEffect, useState } from 'react';

interface HeatmapVisualizerProps {
  imageUrl: string;
  detectionData: {
    heatmapData: number[][];
  };
}

const HeatmapVisualizer = ({ imageUrl, detectionData }: HeatmapVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw heatmap overlay
      if (detectionData.heatmapData && detectionData.heatmapData.length > 0) {
        const heatmapData = detectionData.heatmapData;
        const cellWidth = canvas.width / heatmapData[0].length;
        const cellHeight = canvas.height / heatmapData.length;
        
        // Create gradient for heatmap (blue to yellow to red)
        const colors = [
          { stop: 0.1, color: 'rgba(0, 0, 255, 0.1)' },    // Blue (low probability)
          { stop: 0.4, color: 'rgba(255, 255, 0, 0.3)' },  // Yellow (medium probability)
          { stop: 0.7, color: 'rgba(255, 128, 0, 0.5)' },  // Orange (high probability)
          { stop: 0.9, color: 'rgba(255, 0, 0, 0.7)' }     // Red (very high probability)
        ];
        
        for (let y = 0; y < heatmapData.length; y++) {
          for (let x = 0; x < heatmapData[y].length; x++) {
            const intensity = heatmapData[y][x];
            if (intensity > 0.05) {  // Only draw visible areas
              // Find the appropriate color based on intensity
              let color = colors[0].color;
              for (let i = 1; i < colors.length; i++) {
                if (intensity >= colors[i-1].stop && intensity <= colors[i].stop) {
                  color = colors[i].color;
                  break;
                }
              }
              
              ctx.fillStyle = color;
              ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            }
          }
        }
        
        // Add a disclaimer overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, canvas.height - 40, 300, 30);
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Heatmap shows potential manipulation regions', 20, canvas.height - 20);
      }
    };
  }, [imageUrl, detectionData, isLoaded]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-black relative">
      <div className="aspect-video flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default HeatmapVisualizer;
