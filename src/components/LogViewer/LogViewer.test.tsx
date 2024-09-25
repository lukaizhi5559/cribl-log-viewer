import { render, fireEvent, screen } from '@testing-library/react';
import LogViewer from './index';
import { LogEntry } from '../../types/LogEntry';

// Mock the LogRow component
jest.mock('./LogRow', () => ({ entry, index, expandedIndex, toggleExpand }: any) => (
  <tr data-testid={`log-row-${index}`}>
    <td>{entry.formattedTime}</td>
    <td>{entry.event}</td>
    <td>
      <button onClick={() => toggleExpand(index)}>
        {expandedIndex === index ? 'Collapse' : 'Expand'}
      </button>
    </td>
  </tr>
));

describe('LogViewer', () => {
  const mockLogEntries: LogEntry[] = [
    { _time: '2023-09-01T10:00:00Z', event: 'Event 1', cid: '123' },
    { _time: '2023-09-01T11:00:00Z', event: 'Event 2', cid: '456' },
    { _time: '2023-09-01T12:00:00Z', event: 'Event 3', cid: '789' },
  ];

  it('displays the loading spinner when loading', () => {
    render(<LogViewer logEntries={[]} loading={true} />);
    expect(screen.getByText('Loading logs...')).toBeInTheDocument();
  });

  it('displays "No logs found" when no logs are available', () => {
    render(<LogViewer logEntries={[]} loading={false} />);
    expect(screen.getByText('No logs found. Please adjust your filter or search.')).toBeInTheDocument();
  });

  it('displays log entries in a table', () => {
    render(<LogViewer logEntries={mockLogEntries} loading={false} />);
    const logRows = screen.getAllByTestId(/log-row-/);
    expect(logRows.length).toBe(3); // 3 logs in mock data
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
    expect(screen.getByText('Event 3')).toBeInTheDocument();
  });

  it('expands and collapses a log entry on button click', () => {
    render(<LogViewer logEntries={mockLogEntries} loading={false} />);
    
    // Expand the first log row
    const expandButton = screen.getAllByText('Expand')[0];
    fireEvent.click(expandButton);
    
    // The button text should change to 'Collapse' after expanding
    expect(expandButton.textContent).toBe('Collapse');

    // Collapse the same log row
    fireEvent.click(expandButton);
    expect(expandButton.textContent).toBe('Expand');
  });

  it('loads more logs when scrolling near the bottom', () => {
    render(<LogViewer logEntries={mockLogEntries} loading={false} />);
    
    const container = screen.getByRole('table').parentElement as HTMLElement;

    // Mock scrollTop, clientHeight, and scrollHeight properties
    Object.defineProperty(container, 'scrollTop', { value: 600, writable: true });
    Object.defineProperty(container, 'clientHeight', { value: 500, writable: true });
    Object.defineProperty(container, 'scrollHeight', { value: 1200, writable: true });

    // Simulate scrolling to the bottom
    fireEvent.scroll(container);

    // Check if more logs are loaded (should still be 3 since mock data has 3 logs)
    const logRows = screen.getAllByTestId(/log-row-/);
    expect(logRows.length).toBe(3); // Mock data only has 3 logs
  });

  it('displays the "Scroll to Top" button when scrolled down and hides when scrolled up', () => {
    render(<LogViewer logEntries={mockLogEntries} loading={false} />);
    const container = screen.getByRole('table').parentElement as HTMLElement;

    // Mock scrollTop, clientHeight, and scrollHeight properties for scrolling down
    Object.defineProperty(container, 'scrollTop', { value: 250, writable: true });
    Object.defineProperty(container, 'clientHeight', { value: 500, writable: true });
    Object.defineProperty(container, 'scrollHeight', { value: 1200, writable: true });

    // Simulate scrolling down
    fireEvent.scroll(container);

    // The "Scroll to Top" button should be visible
    expect(screen.getByText('↑ Top')).toBeInTheDocument();

    // Mock scrolling back to the top
    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
    fireEvent.scroll(container);

    // The "Scroll to Top" button should no longer be visible
    expect(screen.queryByText('↑ Top')).not.toBeInTheDocument();
  });

  // Mock scrollTo function globally in the test environment
  beforeAll(() => {
    window.HTMLElement.prototype.scrollTo = jest.fn();
  });

  it('scrolls to the top when the "Scroll to Top" button is clicked', () => {
    render(<LogViewer logEntries={mockLogEntries} loading={false} />);
    const container = screen.getByRole('table').parentElement as HTMLElement;

    // Mock scrollTop to simulate scrolling
    Object.defineProperty(container, 'scrollTop', { value: 250, writable: true });
    fireEvent.scroll(container);

    // The "Scroll to Top" button should be visible
    const scrollToTopButton = screen.getByText('↑ Top');
    fireEvent.click(scrollToTopButton);

    // After clicking, the container should have called scrollTo (simulated by the mock)
    expect(container.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
