import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { WeatherSkeleton } from '../WeatherSkeleton';
import { render } from '@/test/render';

describe('WeatherSkeleton', () => {
  beforeEach(() => {
    render(<WeatherSkeleton />);
  });

  it('renders main container with skeleton layout', () => {
    const skeletons = document.querySelectorAll('.chakra-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);

    // Main container should contain skeletons
    const mainContainer = skeletons[0].closest('.chakra-stack');
    expect(mainContainer).toBeInTheDocument();
  });

  it('renders correct structure of current weather section', () => {
    const skeletons = document.querySelectorAll('.chakra-skeleton');
    const stacks = document.querySelectorAll('.chakra-stack');

    // Verify basic structure exists
    expect(skeletons.length).toBeGreaterThan(0);
    expect(stacks.length).toBeGreaterThan(0);

    // Verify hierarchy
    const currentWeatherStack = stacks[0];
    expect(currentWeatherStack).toBeInTheDocument();
    expect(currentWeatherStack.querySelectorAll('.chakra-skeleton').length).toBeGreaterThan(0);
  });

  it('renders forecast section with correct structure', () => {
    const stacks = document.querySelectorAll('.chakra-stack');
    const forecastItems = Array.from(stacks).filter(stack =>
      stack.querySelectorAll('.chakra-skeleton').length === 3
    );

    // Should have multiple items with 3 skeletons each (date, temp, desc)
    expect(forecastItems.length).toBeGreaterThan(0);

    forecastItems.forEach(item => {
      const itemSkeletons = item.querySelectorAll('.chakra-skeleton');
      expect(itemSkeletons.length).toBe(3);
    });
  });

  it('renders skeletons for both current weather and forecast', () => {
    const skeletons = document.querySelectorAll('.chakra-skeleton');
    expect(skeletons.length).toBeGreaterThan(5); // Should have multiple skeletons for both sections
  });

  it('renders correct layout structure with stacks', () => {
    const stacks = document.querySelectorAll('.chakra-stack');
    expect(stacks.length).toBeGreaterThan(3); // Main + current weather + forecast stacks

    // Verify nested structure
    stacks.forEach(stack => {
      const hasNestedElements = stack.querySelectorAll('.chakra-skeleton, .chakra-stack').length > 0;
      expect(hasNestedElements).toBe(true);
    });
  });
});