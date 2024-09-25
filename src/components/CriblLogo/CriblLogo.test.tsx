import React from 'react';
import { render } from '@testing-library/react';
import CriblLogo from './index';

describe('CriblLogo', () => {
  it('should render the CriblLogo SVG', () => {
    const { container } = render(<CriblLogo />);

    // Check that the container includes an SVG element
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();

    // Ensure that the SVG has the correct class for styling
    expect(svgElement).toHaveClass('cribl-logo');

    // Ensure the SVG has the correct 'viewBox' and 'preserveAspectRatio' attributes
    expect(svgElement).toHaveAttribute('viewBox', '0 0 173.93 48');
    expect(svgElement).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
  });
});
