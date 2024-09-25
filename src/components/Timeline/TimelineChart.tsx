import React, { useRef, memo } from 'react';
import { LogEntry } from '../../types/LogEntry';
import useLogWorker from '../../hooks/useLogWorker'; // Import the useLogWorker hook
import useG2PlotColumn from '../../hooks/useG2PlotColumn'; // Import the useG2PlotColumn hook

interface TimelineChartProps {
  logEntries: LogEntry[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ logEntries }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  // Use the log worker to process log entries and get chart data
  const chartData = useLogWorker(logEntries);

  // Initialize and render the G2Plot Column chart using the chart data
  useG2PlotColumn(chartData, chartContainerRef);

  return <div ref={chartContainerRef} style={{ height: '300px', width: '100%' }}></div>;
};

export default memo(TimelineChart);
