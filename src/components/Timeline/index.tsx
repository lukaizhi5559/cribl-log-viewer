import React, { memo, useState } from 'react';
import { LogEntry } from '../../types/LogEntry';
import TimelineChart from './TimelineChart';
import './Timeline.css';

interface TimelineProps {
  logEntries: LogEntry[];
}

const Timeline: React.FC<TimelineProps> = ({ logEntries }) => {
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  return (
    <div className="timeline-container">
      <button
        className="toggle-timeline-button"
        onClick={() => setIsTimelineExpanded((prev) => !prev)}
      >
        {isTimelineExpanded ? '▲ Collapse Timeline' : '▼ Show Timeline'}
      </button>
      {isTimelineExpanded &&
        <TimelineChart logEntries={logEntries} />
      }
    </div>
  )
};

export default memo(Timeline);
