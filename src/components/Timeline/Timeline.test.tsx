import { render, fireEvent, screen } from '@testing-library/react';
import Timeline from './index';
import { LogEntry } from '../../types/LogEntry';

// Mock the TimelineChart component
jest.mock('./TimelineChart', () => () => <div data-testid="timeline-chart">Timeline Chart</div>);

describe('Timeline', () => {
  const mockLogEntries: LogEntry[] = [
    { _time: '2023-09-01T10:00:00Z', event: 'Event 1', cid: '123' },
    { _time: '2023-09-01T11:00:00Z', event: 'Event 2', cid: '456' },
  ];

  it('renders the "Show Timeline" button initially', () => {
    render(<Timeline logEntries={mockLogEntries} />);
    expect(screen.getByText('▼ Show Timeline')).toBeInTheDocument();
  });

  it('toggles the timeline chart when the button is clicked', () => {
    render(<Timeline logEntries={mockLogEntries} />);
    
    const toggleButton = screen.getByText('▼ Show Timeline');
    
    // Initially, the TimelineChart should not be visible
    expect(screen.queryByTestId('timeline-chart')).not.toBeInTheDocument();
    
    // Click to show the timeline
    fireEvent.click(toggleButton);
    expect(screen.getByText('▲ Collapse Timeline')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-chart')).toBeInTheDocument(); // TimelineChart should appear

    // Click to hide the timeline
    fireEvent.click(screen.getByText('▲ Collapse Timeline'));
    expect(screen.getByText('▼ Show Timeline')).toBeInTheDocument();
    expect(screen.queryByTestId('timeline-chart')).not.toBeInTheDocument(); // TimelineChart should disappear
  });
});
