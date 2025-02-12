import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { AlertSkeleton } from '../AlertListSkeleton';
import { render } from '@/test/render';

describe('AlertSkeleton', () => {
  beforeEach(() => {
    render(<AlertSkeleton />);
  });

  it('renders the heading correctly', () => {
    const heading = screen.getByRole('heading', { name: /weather alerts/i });
    expect(heading).toHaveTextContent('Weather Alerts');
    expect(heading).toHaveClass('chakra-heading');
  });

  it('renders skeleton layout', () => {
    // Get main container after heading
    const heading = screen.getByRole('heading', { name: /weather alerts/i });
    const skeletonContainer = heading.parentElement?.querySelector('.chakra-stack');
    expect(skeletonContainer).toBeInTheDocument();
    expect(skeletonContainer).toHaveClass('chakra-stack');
  });

  it('renders correct number of skeleton elements', () => {
    const skeletons = document.querySelectorAll('.chakra-skeleton');
    expect(skeletons).toHaveLength(6);
  });

  it('renders stacks with correct structure', () => {
    const stacks = document.querySelectorAll('.chakra-stack');
    expect(stacks.length).toBeGreaterThanOrEqual(3);
  });
});