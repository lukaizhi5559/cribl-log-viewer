import { render } from '@testing-library/react';
import '@testing-library/jest-dom';  // For Jest DOM matchers
import App from './App';

test('renders App with Cribl logo', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Log Viewer/i);
  expect(linkElement).toBeInTheDocument();
});
