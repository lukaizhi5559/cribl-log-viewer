import { render, act } from '@testing-library/react';
import useDebounce from './useDebounce';

// Test component that uses the `useDebounce` hook
const TestComponent = ({ value, delay }: { value: string; delay: number }) => {
  const debouncedValue = useDebounce(value, delay);
  return <div data-testid="debounced-value">{debouncedValue}</div>;
};

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { getByTestId } = render(<TestComponent value="test" delay={300} />);
    expect(getByTestId('debounced-value').textContent).toBe('test'); // Initial value should be returned immediately
  });

  it('should update the debounced value after the delay', () => {
    const { getByTestId, rerender } = render(
      <TestComponent value="initial" delay={300} />
    );

    // Initially, the debounced value should be "initial"
    expect(getByTestId('debounced-value').textContent).toBe('initial');

    // Change the value before the debounce delay
    rerender(<TestComponent value="new value" delay={300} />);

    // Still returns the old value because the debounce delay hasn't passed
    expect(getByTestId('debounced-value').textContent).toBe('initial');

    // Fast-forward time by 300ms (the debounce delay)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now the debounced value should update to "new value"
    expect(getByTestId('debounced-value').textContent).toBe('new value');
  });

  it('should reset the debounce timer when the value changes', () => {
    const { getByTestId, rerender } = render(
      <TestComponent value="initial" delay={300} />
    );

    // Initially, the debounced value should be "initial"
    expect(getByTestId('debounced-value').textContent).toBe('initial');

    // Change the value before the debounce delay
    rerender(<TestComponent value="new value" delay={300} />);

    // Still returns the old value because the debounce delay hasn't passed
    expect(getByTestId('debounced-value').textContent).toBe('initial');

    // Change the value again before the debounce delay finishes
    rerender(<TestComponent value="another value" delay={300} />);

    // Fast-forward time by 200ms (less than the delay)
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // It should still return the old value since the debounce delay hasn't finished
    expect(getByTestId('debounced-value').textContent).toBe('initial');

    // Fast-forward by another 300ms (to surpass the debounce delay after the last change)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now the debounced value should be updated to the last value
    expect(getByTestId('debounced-value').textContent).toBe('another value');
  });

  it('should clean up the timer when unmounted', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
  
    const { unmount } = render(<TestComponent value="test" delay={300} />);
  
    unmount();
  
    // Ensure the clearTimeout function is called when the component unmounts
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  
    clearTimeoutSpy.mockRestore(); // Restore the original clearTimeout after the test
  });  
});
