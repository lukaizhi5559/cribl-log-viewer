import { render } from '@testing-library/react';
import { useRef } from 'react';
import useG2PlotColumn from './useG2PlotColumn';
import { Column } from '@antv/g2plot';

// Mock the Column class from @antv/g2plot
jest.mock('@antv/g2plot', () => ({
  Column: jest.fn(),
}));

// Set up individual spies for render and destroy
const mockRender = jest.fn();
const mockDestroy = jest.fn();

beforeEach(() => {
  // Reset the mocks before each test
  mockRender.mockClear();
  mockDestroy.mockClear();

  // Ensure the constructor instantiates the Column class and attaches render and destroy
  (Column as any).mockImplementation(() => ({
    render: mockRender, // Attach the mock for render
    destroy: mockDestroy, // Attach the mock for destroy
  }));
});

describe('useG2PlotColumn', () => {
  let container: HTMLDivElement | null = null;
  let chartData: any[];

  beforeEach(() => {
    // Set up container and chart data for tests
    container = document.createElement('div');
    document.body.appendChild(container);
    chartData = [
      { day: 'Monday', logs: 10 },
      { day: 'Tuesday', logs: 15 },
    ];
  });

  afterEach(() => {
    // Clean up after each test
    if (container) {
      container.remove();
      container = null;
    }
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  const TestComponent = ({ data }: { data: any[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useG2PlotColumn(data, containerRef);
    return <div ref={containerRef}></div>;
  };

  it('should initialize and render the column chart', () => {
    render(<TestComponent data={chartData} />);
    
    // Ensure the Column constructor was called once
    expect(Column).toHaveBeenCalledTimes(1);

    // Ensure the render method was called on the Column instance
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('should not render the chart if there is no data', () => {
    render(<TestComponent data={[]} />);

    // Ensure Column constructor was not called when no data is present
    expect(Column).not.toHaveBeenCalled();
  });

  it('should destroy the chart on unmount', () => {
    const { unmount } = render(<TestComponent data={chartData} />);
    
    // Unmount the component
    unmount();
    
    // Ensure the destroy method was called on unmount
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});
