import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import useFilteredLogs from './useFilteredLogs';
import useDebounce from './useDebounce';

// Mock useDebounce hook
jest.mock('./useDebounce', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// TestComponent that uses the `useFilteredLogs` hook
const TestComponent = ({ logEntries }: { logEntries: any[] }) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCid,
    setSelectedCid,
    selectedChannel,
    setSelectedChannel,
    selectedLevel,
    setSelectedLevel,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    cidOptions,
    channelOptions,
    levelOptions,
    filteredLogEntries,
  } = useFilteredLogs(logEntries);

  return (
    <div>
      <input
        data-testid="search-term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        data-testid="cid-select"
        value={selectedCid}
        onChange={(e) => setSelectedCid(e.target.value)}
      >
        {cidOptions.map((cid) => (
          <option key={cid} value={cid}>
            {cid}
          </option>
        ))}
      </select>
      <select
        data-testid="channel-select"
        value={selectedChannel}
        onChange={(e) => setSelectedChannel(e.target.value)}
      >
        {channelOptions.map((channel) => (
          <option key={channel} value={channel}>
            {channel}
          </option>
        ))}
      </select>
      <select
        data-testid="level-select"
        value={selectedLevel}
        onChange={(e) => setSelectedLevel(e.target.value)}
      >
        {levelOptions.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      <input
        data-testid="start-date"
        type="date"
        value={startDate ? startDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
      />
      <input
        data-testid="end-date"
        type="date"
        value={endDate ? endDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
      />
      <ul data-testid="log-entries">
        {filteredLogEntries.map((entry, index) => (
          <li key={index}>{entry.message}</li>
        ))}
      </ul>
    </div>
  );
};

describe('useFilteredLogs with TestComponent', () => {
  let logEntries: any[];

  beforeEach(() => {
    logEntries = [
      { cid: '123', channel: 'A', level: 'info', _time: '2023-01-01T10:00:00Z', message: 'Log entry 1' },
      { cid: '456', channel: 'B', level: 'error', _time: '2023-01-02T12:00:00Z', message: 'Log entry 2' },
      { cid: '123', channel: 'A', level: 'error', _time: '2023-01-03T14:00:00Z', message: 'Log entry 3' },
    ];

    // Mock useDebounce to return the search term immediately
    (useDebounce as jest.Mock).mockImplementation((value) => value);
  });

  it('should render and filter logs based on search term', () => {
    const { getByTestId } = render(<TestComponent logEntries={logEntries} />);

    // Initially all log entries should be rendered
    const logEntriesUl = getByTestId('log-entries');
    expect(logEntriesUl.textContent).toContain('Log entry 1');
    expect(logEntriesUl.textContent).toContain('Log entry 2');
    expect(logEntriesUl.textContent).toContain('Log entry 3');

    // Update the search term to "Log entry 1"
    const searchInput = getByTestId('search-term');
    fireEvent.change(searchInput, { target: { value: 'Log entry 1' } });

    // After updating the search term, only one log entry should be filtered
    expect(logEntriesUl.textContent).toContain('Log entry 1');
    expect(logEntriesUl.textContent).not.toContain('Log entry 2');
    expect(logEntriesUl.textContent).not.toContain('Log entry 3');
  });

  it('should filter logs based on selected CID', () => {
    const { getByTestId } = render(<TestComponent logEntries={logEntries} />);

    const logEntriesUl = getByTestId('log-entries');
    expect(logEntriesUl.textContent).toContain('Log entry 1');
    expect(logEntriesUl.textContent).toContain('Log entry 2');
    expect(logEntriesUl.textContent).toContain('Log entry 3');

    const cidSelect = getByTestId('cid-select');
    fireEvent.change(cidSelect, { target: { value: '123' } });

    // After updating the CID, only log entries with cid '123' should be filtered
    expect(logEntriesUl.textContent).toContain('Log entry 1');
    expect(logEntriesUl.textContent).toContain('Log entry 3');
    expect(logEntriesUl.textContent).not.toContain('Log entry 2');
  });

  it('should filter logs based on selected channel', () => {
    const { getByTestId } = render(<TestComponent logEntries={logEntries} />);

    const logEntriesUl = getByTestId('log-entries');
    expect(logEntriesUl.textContent).toContain('Log entry 1');
    expect(logEntriesUl.textContent).toContain('Log entry 2');
    expect(logEntriesUl.textContent).toContain('Log entry 3');

    const channelSelect = getByTestId('channel-select');
    fireEvent.change(channelSelect, { target: { value: 'B' } });

    // After updating the channel, only log entries with channel 'B' should be filtered
    expect(logEntriesUl.textContent).toContain('Log entry 2');
    expect(logEntriesUl.textContent).not.toContain('Log entry 1');
    expect(logEntriesUl.textContent).not.toContain('Log entry 3');
  });

  it('should filter logs based on date range', () => {
    const { getByTestId } = render(<TestComponent logEntries={logEntries} />);

    const logEntriesUl = getByTestId('log-entries');
    expect(logEntriesUl.textContent).toContain('Log entry 1');
    expect(logEntriesUl.textContent).toContain('Log entry 2');
    expect(logEntriesUl.textContent).toContain('Log entry 3');

    // Set start and end dates to filter logs
    const startDateInput = getByTestId('start-date');
    const endDateInput = getByTestId('end-date');

    fireEvent.change(startDateInput, { target: { value: '2023-01-02' } });
    fireEvent.change(endDateInput, { target: { value: '2023-01-03' } });

    // After setting the date range, only the log entry on '2023-01-02' should be filtered
    expect(logEntriesUl.textContent).toContain('Log entry 2');
    expect(logEntriesUl.textContent).not.toContain('Log entry 1');
    expect(logEntriesUl.textContent).not.toContain('Log entry 3');
  });

  it('should render unique dropdown options for CID, channel, and level', () => {
    const { getByTestId } = render(<TestComponent logEntries={logEntries} />);

    const cidSelect = getByTestId('cid-select');
    const channelSelect = getByTestId('channel-select');
    const levelSelect = getByTestId('level-select');

    expect(cidSelect.children).toHaveLength(2); // Two unique CIDs: '123', '456'
    expect(channelSelect.children).toHaveLength(2); // Two unique channels: 'A', 'B'
    expect(levelSelect.children).toHaveLength(2); // Two unique levels: 'info', 'error'
  });
});
