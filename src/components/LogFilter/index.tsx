import React, { memo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./LogFilter.css";

interface FilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cidOptions: string[];
  channelOptions: string[];
  levelOptions: string[];
  selectedCid: string;
  setSelectedCid: (cid: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

const LogFilter: React.FC<FilterProps> = ({
  searchTerm,
  setSearchTerm,
  cidOptions,
  channelOptions,
  levelOptions,
  selectedCid,
  setSelectedCid,
  selectedChannel,
  setSelectedChannel,
  selectedLevel,
  setSelectedLevel,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="Search logs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="filter-input"
        data-testid="search-input"
      />

      <div className="filter-dropdowns">
        <select
          value={selectedCid}
          onChange={(e) => setSelectedCid(e.target.value)}
          data-testid="cid-select"
        >
          <option value="">All CIDs</option>
          {cidOptions.map((cid) => (
            <option key={cid} value={cid}>{cid}</option>
          ))}
        </select>

        <select
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          data-testid="channel-select"
        >
          <option value="">All Channels</option>
          {channelOptions.map((channel) => (
            <option key={channel} value={channel}>{channel}</option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          data-testid="level-select"
        >
          <option value="">All Levels</option>
          {levelOptions.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <div>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            placeholderText="Start Date"
            isClearable
            data-testid="start-date-picker"
          />
        </div>

        <div>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            placeholderText="End Date"
            isClearable
            data-testid="end-date-picker"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(LogFilter);
