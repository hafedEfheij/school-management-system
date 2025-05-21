'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClientOnly } from './client-only';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartOptions {
  title?: string;
  showLegend?: boolean;
  showValues?: boolean;
  showLabels?: boolean;
  height?: number;
  width?: number;
  responsive?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  colors?: string[];
}

interface SafeChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartDataPoint[];
  options?: ChartOptions;
  className?: string;
  titleClassName?: string;
  legendClassName?: string;
  chartClassName?: string;
}

/**
 * A hydration-safe chart component that handles SSR and client-side rendering properly
 */
export function SafeChart({
  type,
  data,
  options = {},
  className,
  titleClassName,
  legendClassName,
  chartClassName,
}: SafeChartProps) {
  const [mounted, setMounted] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  // Default options
  const defaultOptions: ChartOptions = {
    showLegend: true,
    showValues: true,
    showLabels: true,
    height: 300,
    width: 500,
    responsive: true,
    valuePrefix: '',
    valueSuffix: '',
    colors: [
      '#4299E1', '#48BB78', '#F6AD55', '#F56565', '#9F7AEA',
      '#ED64A6', '#38B2AC', '#ECC94B', '#E53E3E', '#667EEA',
    ],
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Only show the UI after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Draw chart
  useEffect(() => {
    if (!mounted || !chartRef.current) return;
    
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    if (mergedOptions.responsive) {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = mergedOptions.height || 300;
      }
    } else {
      canvas.width = mergedOptions.width || 500;
      canvas.height = mergedOptions.height || 300;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw chart based on type
    switch (type) {
      case 'bar':
        drawBarChart(ctx, canvas, data, mergedOptions);
        break;
      case 'line':
        drawLineChart(ctx, canvas, data, mergedOptions);
        break;
      case 'pie':
        drawPieChart(ctx, canvas, data, mergedOptions, false);
        break;
      case 'doughnut':
        drawPieChart(ctx, canvas, data, mergedOptions, true);
        break;
      default:
        break;
    }
  }, [mounted, type, data, mergedOptions]);
  
  // Draw bar chart
  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: ChartDataPoint[],
    options: ChartOptions
  ) => {
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find max value
    const maxValue = Math.max(...data.map((item) => item.value));
    
    // Calculate bar width
    const barWidth = chartWidth / data.length / 1.5;
    const barSpacing = barWidth / 2;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw bars
    data.forEach((item, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing;
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = height - padding - barHeight;
      
      // Draw bar
      ctx.fillStyle = item.color || options.colors![index % options.colors!.length];
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw value
      if (options.showValues) {
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${options.valuePrefix}${item.value}${options.valueSuffix}`,
          x + barWidth / 2,
          y - 5
        );
      }
      
      // Draw label
      if (options.showLabels) {
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(
          item.label,
          x + barWidth / 2,
          height - padding + 15
        );
      }
    });
  };
  
  // Draw line chart
  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: ChartDataPoint[],
    options: ChartOptions
  ) => {
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find max value
    const maxValue = Math.max(...data.map((item) => item.value));
    
    // Calculate point spacing
    const pointSpacing = chartWidth / (data.length - 1);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = options.colors![0];
    ctx.lineWidth = 2;
    
    data.forEach((item, index) => {
      const x = padding + index * pointSpacing;
      const y = height - padding - (item.value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw point
      ctx.fillStyle = item.color || options.colors![index % options.colors!.length];
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw value
      if (options.showValues) {
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${options.valuePrefix}${item.value}${options.valueSuffix}`,
          x,
          y - 10
        );
      }
      
      // Draw label
      if (options.showLabels) {
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(
          item.label,
          x,
          height - padding + 15
        );
      }
    });
    
    ctx.stroke();
  };
  
  // Draw pie/doughnut chart
  const drawPieChart = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    data: ChartDataPoint[],
    options: ChartOptions,
    isDoughnut: boolean
  ) => {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    
    // Calculate total value
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Draw slices
    let startAngle = 0;
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = item.color || options.colors![index % options.colors!.length];
      ctx.fill();
      
      // Draw label and value
      if (options.showLabels || options.showValues) {
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const x = centerX + Math.cos(midAngle) * labelRadius;
        const y = centerY + Math.sin(midAngle) * labelRadius;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (options.showLabels && options.showValues) {
          ctx.fillText(
            `${item.label}: ${options.valuePrefix}${item.value}${options.valueSuffix}`,
            x,
            y
          );
        } else if (options.showLabels) {
          ctx.fillText(item.label, x, y);
        } else if (options.showValues) {
          ctx.fillText(
            `${options.valuePrefix}${item.value}${options.valueSuffix}`,
            x,
            y
          );
        }
      }
      
      startAngle = endAngle;
    });
    
    // Draw doughnut hole
    if (isDoughnut) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
  };
  
  // Render legend
  const renderLegend = () => {
    return (
      <div className={`flex flex-wrap justify-center mt-4 ${legendClassName || ''}`}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center mx-2 mb-2">
            <div
              className="w-4 h-4 mr-1"
              style={{ backgroundColor: item.color || mergedOptions.colors![index % mergedOptions.colors!.length] }}
            />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Simple loading state for SSR
  const ChartSkeleton = () => (
    <div className={`w-full ${className || ''}`}>
      {mergedOptions.title && (
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
      )}
      <div
        className="bg-gray-200 dark:bg-gray-700 rounded mx-auto"
        style={{
          width: mergedOptions.responsive ? '100%' : `${mergedOptions.width}px`,
          height: `${mergedOptions.height}px`,
        }}
      ></div>
      {mergedOptions.showLegend && (
        <div className="flex flex-wrap justify-center mt-4">
          {Array.from({ length: Math.min(data.length, 5) }).map((_, index) => (
            <div key={index} className="flex items-center mx-2 mb-2">
              <div className="w-4 h-4 mr-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  // If not mounted, show skeleton
  if (!mounted) {
    return <ChartSkeleton />;
  }
  
  return (
    <ClientOnly fallback={<ChartSkeleton />}>
      <div className={`w-full ${className || ''}`}>
        {/* Title */}
        {mergedOptions.title && (
          <h3 className={`text-center text-lg font-medium mb-4 ${titleClassName || ''}`}>
            {mergedOptions.title}
          </h3>
        )}
        
        {/* Chart */}
        <div className={`relative ${chartClassName || ''}`}>
          <canvas
            ref={chartRef}
            width={mergedOptions.width}
            height={mergedOptions.height}
            style={{
              width: mergedOptions.responsive ? '100%' : `${mergedOptions.width}px`,
              height: `${mergedOptions.height}px`,
            }}
          />
        </div>
        
        {/* Legend */}
        {mergedOptions.showLegend && renderLegend()}
      </div>
    </ClientOnly>
  );
}
