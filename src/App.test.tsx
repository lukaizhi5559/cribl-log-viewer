import { render } from '@testing-library/react';
import '@testing-library/jest-dom';  // For Jest DOM matchers
import App from './App';

// General mock setup for all tests
jest.mock('./hooks/useLogWorker', () => ({
  __esModule: true,
  default: jest.fn(() => [{ day: '2024-09-25', logs: 100 }]),
}));

jest.mock('./components/Timeline', () => () => <div>Mocked Timeline</div>);

test('renders App with Cribl logo', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Log Viewer/i);
  expect(linkElement).toBeInTheDocument();
});
