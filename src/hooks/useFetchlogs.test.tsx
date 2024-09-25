import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import useFetchLogs from './useFetchLogs';
import { fetchLogs } from '../helpers/fetchLogs';

// Mock fetchLogs function
jest.mock('../helpers/fetchLogs');

const mockFetchLogs = fetchLogs as jest.Mock;

// Test component that uses the hook
const TestComponent = ({ url }: { url: string }) => {
  const { logEntries, loading, error } = useFetchLogs(url);

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">{error}</div>;
  return (
    <ul data-testid="log-entries">
      {logEntries.map((log, index) => (
        <li key={index}>{log.message}</li>
      ))}
    </ul>
  );
};

describe('useFetchLogs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading initially', async () => {
    mockFetchLogs.mockImplementationOnce(() => {
        return new Promise((resolve) => setTimeout(() => resolve([]), 100));
    });

    await act(async () => {
        render(<TestComponent url="test-url" />)
    });
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should display log entries after fetching logs', async () => {
    const mockLogs = [{ id: 1, message: 'Log 1' }, { id: 2, message: 'Log 2' }];
    mockFetchLogs.mockImplementationOnce((url, callback) => {
      callback(mockLogs);
      return Promise.resolve();
    });

    await act(async () => {
        render(<TestComponent url="test-url" />)
    });

    await waitFor(() => expect(screen.getByTestId('log-entries')).toBeInTheDocument());
    expect(screen.getByText('Log 1')).toBeInTheDocument();
    expect(screen.getByText('Log 2')).toBeInTheDocument();
  });

  it('should display error when fetchLogs fails', async () => {
    mockFetchLogs.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
        render(<TestComponent url="test-url" />)
    });

    await waitFor(() => expect(screen.getByTestId('error')).toBeInTheDocument());
    expect(screen.getByText('Failed to fetch logs. Please try again.')).toBeInTheDocument();
  });
});
