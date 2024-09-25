import React, { memo } from 'react';
import { LogEntry } from '../../types/LogEntry';

interface LogRowProps {
  entry: LogEntry;
  index: number;
  expandedIndex: number | null;
  toggleExpand: (index: number) => void;
}

const LogRow: React.FC<LogRowProps> = ({ entry, index, expandedIndex, toggleExpand }) => {
  return (
    <>
      <tr
        className={`${expandedIndex === index ? 'active' : ''}`}
        onClick={() => toggleExpand(index)}
      >
        <td className={`${expandedIndex === index ? 'log-caret active' : 'log-caret'}`}>
          {expandedIndex === index ? '▼' : '►'}
        </td>
        <td>{entry.formattedTime}</td>
        <td className='log-entry'>{JSON.stringify(entry)}</td>
      </tr>
      {expandedIndex === index && (
        <tr>
          <td colSpan={3} className='log-expanded'>
            <pre>{JSON.stringify(entry, null, 2)}</pre>
          </td>
        </tr>
      )}
    </>
  );
};

export default memo(LogRow);
