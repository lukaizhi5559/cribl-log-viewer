import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { LogEntry } from '../../types/LogEntry';
import LogRow from './LogRow';
import './LogViewer.css';

interface LogViewerProps {
  logEntries: LogEntry[];
  loading: boolean;
}

const LogViewer: React.FC<LogViewerProps> = ({ logEntries, loading }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleLogCount, setVisibleLogCount] = useState(50); // Start with 50 logs
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Memoize the processed log entries to avoid recalculating on every render
  const processedLogEntries = useMemo(() => {
    return logEntries.map((entry) => ({
      ...entry,
      formattedTime: entry._time ? new Date(entry._time).toISOString() : 'N/A',
    }));
  }, [logEntries]);

  // Hanlde toggle row open and close
  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  // Handle scroll event and load more logs when near the bottom
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    setShowScrollToTop(scrollTop > 200);

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setVisibleLogCount((prevCount) => Math.min(prevCount + 50, logEntries.length)); // Load 50 more logs
    }
  };

  // Handle scroll to top action
  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Reset visible log count when new logs are loaded
    setVisibleLogCount(50);
  }, [logEntries]);

  if (loading) {
    return (
      <div className='preloader'>
        <div className='spinner'></div>
        <p>Loading logs...</p>
      </div>
    );
  }

  if (logEntries.length === 0) {
    return <p>No logs found. Please adjust your filter or search.</p>;
  }

  return (
    <div
      className='log-viewer-container'
      ref={containerRef}
      onScroll={handleScroll}
      style={{ overflowY: 'auto', height: '600px', position: 'relative' }}
    >
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Time</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          {processedLogEntries.slice(0, visibleLogCount).map((entry, index) => (
            <LogRow
              key={index}
              entry={entry}
              index={index}
              expandedIndex={expandedIndex}
              toggleExpand={toggleExpand}
            />
          ))}
        </tbody>
      </table>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          className='scroll-to-top-button'
          onClick={scrollToTop}
        >
          ↑ Top
        </button>
      )}
    </div>
  );
};

export default memo(LogViewer);
