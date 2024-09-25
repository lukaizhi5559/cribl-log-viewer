import { useState, useEffect } from 'react';
import { fetchLogs } from '../helpers/fetchLogs';

const useFetchLogs = (url: string) => {
  const [logEntries, setLogEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchLogs(url, setLogEntries);
        setLoading(false);
      } catch (e) {
        setError('Failed to fetch logs. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { logEntries, loading, error };
};

export default useFetchLogs;
