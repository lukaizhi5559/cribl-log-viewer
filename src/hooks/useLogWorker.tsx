import { useEffect, useState } from 'react';
import { LogEntry } from '../types/LogEntry'; // Assuming LogEntry is defined elsewhere

const useLogWorker = (logEntries: LogEntry[]) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (logEntries.length === 0) return;

    const worker = new Worker(new URL('../helpers/logWorker.js', import.meta.url)); // Load the worker
    worker.postMessage({ logEntries }); // Send log entries to the worker

    worker.onmessage = (e) => {
      setChartData(e.data); // Set the processed data
      worker.terminate(); // Terminate the worker after data is received
    };

    return () => {
      if (worker) {
        worker.terminate(); // Ensure the worker is terminated if the component unmounts
      }
    };
  }, [logEntries]);

  return chartData;
};

export default useLogWorker;
