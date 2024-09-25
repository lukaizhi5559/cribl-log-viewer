import { useEffect, useRef } from 'react';
import { Column } from '@antv/g2plot';

const useG2PlotColumn = (chartData: any[], containerRef: React.RefObject<HTMLDivElement>) => {
  const chartRef = useRef<Column | null>(null);

  useEffect(() => {
    if (!containerRef.current || chartData.length === 0) return;

    try {
      const columnPlot = new Column(containerRef.current as HTMLDivElement, {
        data: chartData,
        xField: 'day',
        yField: 'logs',
        xAxis: {
          type: 'cat',
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        color: '#00cccc',
        interactions: [{ type: 'tooltip' }, { type: 'active-region' }],
        slider: {
          start: 0,
          end: 1,
        },
        label: {
          position: 'middle',
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        },
        tooltip: {
          showMarkers: false,
        },
        state: {
          active: {
            style: {
              shadowColor: 'rgba(0,0,0,0.5)',
              shadowBlur: 4,
              stroke: '#000',
              fillOpacity: 0.65,
            },
          },
        },
      });
  
      // Render the chart
      columnPlot.render();
      chartRef.current = columnPlot;
    } catch (error) {
      console.error('Error rendering G2Plot column chart:', error);
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [chartData, containerRef]);

  return chartRef.current;
};

export default useG2PlotColumn;
