"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { type mockEntries, mockEmotions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"
import { Calendar, BarChart2, LineChart, PieChart } from "lucide-react"

interface SentimentTimelineProps {
  entries: typeof mockEntries
}

type TimeRange = "7d" | "30d" | "90d" | "1y" | "all"
type ChartType = "line" | "bar" | "pie" | "radar"

export function SentimentTimeline({ entries }: SentimentTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, value: number, label: string} | null>(null);
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  // Draw chart with animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set animation flag
    setIsAnimating(true);
    
    // Get data based on time range
    const data = getDataForTimeRange(timeRange);
    
    // Draw chart based on type
    switch (chartType) {
      case "line":
        drawLineChart(ctx, data);
        break;
      case "bar":
        drawBarChart(ctx, data);
        break;
      case "pie":
        drawPieChart(ctx, data);
        break;
      case "radar":
        drawRadarChart(ctx, data);
        break;
    }
    
    // Reset animation flag after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    
  }, [entries, theme, timeRange, chartType]);
  
  // Handle mouse move for tooltips
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (chartType === 'pie' || chartType === 'radar' || isAnimating) {
        setHoveredPoint(null);
        return;
      }
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Get data based on time range
      const data = getDataForTimeRange(timeRange);
      
      // Calculate chart dimensions
      const width = canvas.width;
      const height = canvas.height;
      const padding = 40;
      const chartWidth = width - 2 * padding;
      const chartHeight = height - 2 * padding;
      
      // Check if mouse is over a data point
      const pointRadius = 5;
      let found = false;
      
      if (chartType === 'line') {
        // For line chart
        data.datasets.forEach((dataset, datasetIndex) => {
          dataset.data.forEach((value, index) => {
            const pointX = padding + (index / (dataset.data.length - 1)) * chartWidth;
            const pointY = height - padding - (value / 100) * chartHeight;
            
            const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
            
            if (distance <= pointRadius * 2) {
              setHoveredPoint({
                x: pointX,
                y: pointY,
                value,
                label: `${dataset.label}: ${value}%`
              });
              found = true;
            }
          });
        });
      } else if (chartType === 'bar') {
        // For bar chart
        const barWidth = chartWidth / (data.labels.length * data.datasets.length);
        
        data.datasets.forEach((dataset, datasetIndex) => {
          dataset.data.forEach((value, index) => {
            const barX = padding + (index * data.datasets.length + datasetIndex) * barWidth;
            const barHeight = (value / 100) * chartHeight;
            const barY = height - padding - barHeight;
            
            if (
              x >= barX && 
              x <= barX + barWidth && 
              y >= barY && 
              y <= barY + barHeight
            ) {
              setHoveredPoint({
                x: barX + barWidth / 2,
                y: barY,
                value,
                label: `${dataset.label}: ${value}%`
              });
              found = true;
            }
          });
        });
      }
      
      if (!found) {
        setHoveredPoint(null);
      }
    };
    
    const handleMouseLeave = () => {
      setHoveredPoint(null);
    };
    
    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
        canvasRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [timeRange, chartType, isAnimating]);
  
  // Get data for selected time range
  const getDataForTimeRange = (range: TimeRange) => {
    const emotions = mockEmotions;
    
    switch (range) {
      case "7d":
        return {
          labels: emotions.labels.slice(-2),
          datasets: emotions.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.slice(-2)
          })),
          dailyMood: emotions.dailyMood.slice(-2)
        };
      case "30d":
        return {
          labels: emotions.labels.slice(-3),
          datasets: emotions.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.slice(-3)
          })),
          dailyMood: emotions.dailyMood.slice(-3)
        };
      case "90d":
        return {
          labels: emotions.labels.slice(-5),
          datasets: emotions.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.slice(-5)
          })),
          dailyMood: emotions.dailyMood.slice(-5)
        };
      case "1y":
      case "all":
      default:
        return emotions;
    }
  };
  
  // Draw line chart
  const drawLineChart = (ctx: CanvasRenderingContext2D, data: typeof mockEmotions) => {
    // Calculate chart dimensions
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = theme === "dark" ? "#6b7280" : "#9ca3af";
    ctx.stroke();
    
    // Draw y-axis labels
    ctx.font = "10px sans-serif";
    ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    
    for (let i = 0; i <= 100; i += 20) {
      const y = height - padding - (i / 100) * chartHeight;
      ctx.fillText(i.toString() + "%", padding - 5, y);
      
      // Draw horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = theme === "dark" ? "rgba(75, 85, 99, 0.2)" : "rgba(209, 213, 219, 0.2)";
      ctx.stroke();
    }
    
    // Draw x-axis labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    
    data.labels.forEach((label, index) => {
      const x = padding + (index / (data.labels.length - 1)) * chartWidth;
      ctx.fillText(label, x, height - padding + 5);
      
      // Draw vertical grid lines
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.strokeStyle = theme === "dark" ? "rgba(75, 85, 99, 0.2)" : "rgba(209, 213, 219, 0.2)";
      ctx.stroke();
    });
    
    // Animation progress
    const progress = isAnimating ? 0 : 1;
    let animationFrame = 0;
    const totalFrames = 60;
    
    // Animation function
    const animate = () => {
      // Calculate current progress
      const currentProgress = isAnimating ? animationFrame / totalFrames : 1;
      
      // Clear chart area (not axes)
      ctx.clearRect(padding + 1, padding, width - padding * 2 - 1, height - padding * 2);
      
      // Draw datasets
      data.datasets.forEach((dataset, datasetIndex) => {
        // Draw line
        ctx.beginPath();
        
        dataset.data.forEach((value, index) => {
          const x = padding + (index / (dataset.data.length - 1)) * chartWidth;
          const y = height - padding - (value / 100) * chartHeight * currentProgress;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.strokeStyle = dataset.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw area under the line
        ctx.lineTo(padding + chartWidth, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = `${dataset.color}20`; // Add transparency
        ctx.fill();
        
        // Draw data points
        dataset.data.forEach((value, index) => {
          const x = padding + (index / (dataset.data.length - 1)) * chartWidth;
          const y = height - padding - (value / 100) * chartHeight * currentProgress;
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = dataset.color;
          ctx.fill();
          ctx.strokeStyle = theme === "dark" ? "#1f2937" : "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
      
      // Draw legend
      const legendX = width - padding - 120;
      const legendY = padding + 10;
      
      data.datasets.forEach((dataset, index) => {
        const y = legendY + index * 20;
        
        // Draw color box
        ctx.fillStyle = dataset.color;
        ctx.fillRect(legendX, y, 12, 12);
        
        // Draw label
        ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(dataset.label, legendX + 16, y + 6);
      });
      
      // Continue animation if not complete
      if (isAnimating && animationFrame < totalFrames) {
        animationFrame++;
        requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animate();
  };
  
  // Draw bar chart
  const drawBarChart = (ctx: CanvasRenderingContext2D, data: typeof mockEmotions) => {
    // Calculate chart dimensions
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = theme === "dark" ? "#6b7280" : "#9ca3af";
    ctx.stroke();
    
    // Draw y-axis labels
    ctx.font = "10px sans-serif";
    ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    
    for (let i = 0; i <= 100; i += 20) {
      const y = height - padding - (i / 100) * chartHeight;
      ctx.fillText(i.toString() + "%", padding - 5, y);
      
      // Draw horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = theme === "dark" ? "rgba(75, 85, 99, 0.2)" : "rgba(209, 213, 219, 0.2)";
      ctx.stroke();
    }
    
    // Calculate bar width
    const groupCount = data.labels.length;
    const groupWidth = chartWidth / groupCount;
    const barCount = data.datasets.length;
    const barWidth = groupWidth / (barCount + 1); // +1 for spacing
    
    // Animation progress
    const progress = isAnimating ? 0 : 1;
    let animationFrame = 0;
    const totalFrames = 60;
    
    // Animation function
    const animate = () => {
      // Calculate current progress
      const currentProgress = isAnimating ? animationFrame / totalFrames : 1;
      
      // Clear chart area (not axes)
      ctx.clearRect(padding + 1, padding, width - padding * 2 - 1, height - padding * 2);
      
      // Draw x-axis labels
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
      
      data.labels.forEach((label, index) => {
        const x = padding + (index + 0.5) * groupWidth;
        ctx.fillText(label, x, height - padding + 5);
        
        // Draw vertical grid lines
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.strokeStyle = theme === "dark" ? "rgba(75, 85, 99, 0.2)" : "rgba(209, 213, 219, 0.2)";
        ctx.stroke();
      });
      
      // Draw bars
      data.datasets.forEach((dataset, datasetIndex) => {
        dataset.data.forEach((value, index) => {
          const x = padding + index * groupWidth + (datasetIndex + 0.5) * barWidth;
          const barHeight = (value / 100) * chartHeight * currentProgress;
          const y = height - padding - barHeight;
          
          // Draw bar
          ctx.fillStyle = dataset.color;
          ctx.fillRect(x, y, barWidth * 0.8, barHeight);
          
          // Add bar border
          ctx.strokeStyle = theme === "dark" ? "#1f2937" : "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, barWidth * 0.8, barHeight);
        });
      });
      
      // Draw legend
      const legendX = width - padding - 120;
      const legendY = padding + 10;
      
      data.datasets.forEach((dataset, index) => {
        const y = legendY + index * 20;
        
        // Draw color box
        ctx.fillStyle = dataset.color;
        ctx.fillRect(legendX, y, 12, 12);
        
        // Draw label
        ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(dataset.label, legendX + 16, y + 6);
      });
      
      // Continue animation if not complete
      if (isAnimating && animationFrame < totalFrames) {
        animationFrame++;
        requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animate();
  };
  
  // Draw pie chart
  const drawPieChart = (ctx: CanvasRenderingContext2D, data: typeof mockEmotions) => {
    // Calculate chart dimensions
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    
    // Calculate total value
    const totals = data.datasets.map(dataset => 
      dataset.data.reduce((sum, value) => sum + value, 0)
    );
    
    // Animation progress
    const progress = isAnimating ? 0 : 1;
    let animationFrame = 0;
    const totalFrames = 60;
    
    // Animation function
    const animate = () => {
      // Calculate current progress
      const currentProgress = isAnimating ? animationFrame / totalFrames : 1;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw title
      ctx.font = "14px sans-serif";
      ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("Average Sentiment Distribution", centerX, 20);
      
      // Draw pie slices
      let startAngle = -Math.PI / 2;
      
      data.datasets.forEach((dataset, datasetIndex) => {
        const total = totals[datasetIndex];
        const sliceAngle = (total / 100) * Math.PI * 2 * currentProgress;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = dataset.color;
        ctx.fill();
        
        ctx.strokeStyle = theme === "dark" ? "#1f2937" : "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw label if slice is big enough
        if (total > 5) {
          const labelAngle = startAngle + sliceAngle / 2;
          const labelRadius = radius * 0.7;
          const labelX = centerX + Math.cos(labelAngle) * labelRadius;
          const labelY = centerY + Math.sin(labelAngle) * labelRadius;
          
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(dataset.label, labelX, labelY);
        }
        
        startAngle += sliceAngle;
      });
      
      // Draw legend
      const legendX = width - 150;
      const legendY = height / 2 - (data.datasets.length * 20) / 2;
      
      data.datasets.forEach((dataset, index) => {
        const y = legendY + index * 20;
        
        // Draw color box
        ctx.fillStyle = dataset.color;
        ctx.fillRect(legendX, y, 12, 12);
        
        // Draw label
        ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`${dataset.label}: ${totals[index].toFixed(1)}%`, legendX + 16, y + 6);
      });
      
      // Continue animation if not complete
      if (isAnimating && animationFrame < totalFrames) {
        animationFrame++;
        requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animate();
  };
  
  // Draw radar chart
  const drawRadarChart = (ctx: CanvasRenderingContext2D, data: typeof mockEmotions) => {
    // Calculate chart dimensions
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    
    // Get average values for each dataset
    const averages = data.datasets.map(dataset => {
      const sum = dataset.data.reduce((acc, val) => acc + val, 0);
      return sum / dataset.data.length;
    });
    
    // Calculate number of axes (one per dataset)
    const numAxes = data.datasets.length;
    const angleStep = (Math.PI * 2) / numAxes;
    
    // Animation progress
    const progress = isAnimating ? 0 : 1;
    let animationFrame = 0;
    const totalFrames = 60;
    
    // Animation function
    const animate = () => {
      // Calculate current progress
      const currentProgress = isAnimating ? animationFrame / totalFrames : 1;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw title
      ctx.font = "14px sans-serif";
      ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("Emotion Radar", centerX, 20);
      
      // Draw axes
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const axisX = centerX + Math.cos(angle) * radius;
        const axisY = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(axisX, axisY);
        ctx.strokeStyle = theme === "dark" ? "rgba(107, 114, 128, 0.5)" : "rgba(156, 163, 175, 0.5)";
        ctx.stroke();
        
        // Draw axis label
        const labelX = centerX + Math.cos(angle) * (radius + 15);
        const labelY = centerY + Math.sin(angle) * (radius + 15);
        
        ctx.font = "12px sans-serif";
        ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data.datasets[i].label, labelX, labelY);
      }
      
      // Draw concentric circles
      for (let r = 20; r <= 100; r += 20) {
        const circleRadius = (r / 100) * radius;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = theme === "dark" ? "rgba(107, 114, 128, 0.2)" : "rgba(156, 163, 175, 0.2)";
        ctx.stroke();
        
        // Draw percentage label
        ctx.font = "10px sans-serif";
        ctx.fillStyle = theme === "dark" ? "rgba(209, 213, 219, 0.5)" : "rgba(75, 85, 99, 0.5)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${r}%`, centerX, centerY - circleRadius);
      }
      
      // Draw data polygon
      ctx.beginPath();
      
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = averages[i] * currentProgress;
        const pointRadius = (value / 100) * radius;
        const pointX = centerX + Math.cos(angle) * pointRadius;
        const pointY = centerY + Math.sin(angle) * pointRadius;
        
        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      
      ctx.closePath();
      ctx.fillStyle = "rgba(16, 185, 129, 0.2)"; // emerald-500 with transparency
      ctx.fill();
      
      ctx.strokeStyle = "#10b981"; // emerald-500
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw data points
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = averages[i] * currentProgress;
        const pointRadius = (value / 100) * radius;
        const pointX = centerX + Math.cos(angle) * pointRadius;
        const pointY = centerY + Math.sin(angle) * pointRadius;
        
        ctx.beginPath();
        ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
        ctx.fillStyle = data.datasets[i].color;
        ctx.fill();
        ctx.strokeStyle = theme === "dark" ? "#1f2937" : "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw value label
        const labelX = pointX + Math.cos(angle) * 10;
        const labelY = pointY + Math.sin(angle) * 10;
        
        ctx.font = "10px sans-serif";
        ctx.fillStyle = theme === "dark" ? "#d1d5db" : "#4b5563";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${value.toFixed(1)}%`, labelX, labelY);
      }
      
      // Continue animation if not complete
      if (isAnimating && animationFrame < totalFrames) {
        animationFrame++;
        requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animate();
  };
  
  return (
    <div className="w-full h-[300px] relative">
      {/* Chart controls */}
      <div className="absolute top-0 right-0 flex gap-2 z-10">
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <SelectTrigger className="h-8 w-[100px]">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">{t("search.timeRange.7days")}</SelectItem>
            <SelectItem value="30d">{t("search.timeRange.30days")}</SelectItem>
            <SelectItem value="90d">{t("search.timeRange.90days")}</SelectItem>
            <SelectItem value="1y">{t("search.timeRange.1year")}</SelectItem>
            <SelectItem value="all">{t("search.timeRange.allTime")}</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-r-none"
            onClick={() => setChartType("line")}
          >
            <LineChart className="h-3.5 w-3.5" />
            <span className="sr-only">{t("search.chartType.line")}</span>
          </Button>
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-none border-l-0"
            onClick={() => setChartType("bar")}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span className="sr-only">{t("search.chartType.bar")}</span>
          </Button>
          <Button
            variant={chartType === "pie" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-none border-l-0"
            onClick={() => setChartType("pie")}
          >
            <PieChart className="h-3.5 w-3.5" />
            <span className="sr-only">{t("search.chartType.pie")}</span>
          </Button>
          <Button
            variant={chartType === "radar" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-l-none border-l-0"
            onClick={() => setChartType("radar")}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sr-only">{t("search.chartType.radar")}</span>
          </Button>
        </div>
      </div>
      
      {/* Canvas for chart */}
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={300}
        className="w-full h-full"
      />
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div 
          className="absolute bg-popover text-popover-foreground px-2 py-1 rounded shadow-md text-xs pointer-events-none z-20"
          style={{
            left: `${hoveredPoint.x}px`,
            top: `${hoveredPoint.y - 30}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredPoint.label}
        </div>
      )}
    </div>
  );
}

