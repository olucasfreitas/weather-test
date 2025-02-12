import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { AlertsList } from '../AlertList';
import { render } from '@/test/render';

describe('AlertsList', () => {
  const mockAlerts = [
    {
      sender_name: 'National Weather Service',
      event: 'Severe Thunderstorm Warning',
      start: 1645484400,
      end: 1645488000,
      description: 'Strong thunderstorms expected',
      tags: ['thunderstorm', 'warning']
    },
    {
      sender_name: 'Met Office',
      event: 'Flood Warning',
      start: 1645484400,
      end: 1645488000,
      description: 'Potential flooding in low-lying areas',
    }
  ];

  it('renders no alerts message when alerts array is empty', () => {
    render(<AlertsList alerts={[]} />);

    expect(screen.getByRole('heading', { name: /weather alerts/i })).toBeInTheDocument();
    expect(screen.getByText('No active weather alerts for this location')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'neutral');
  });

  it('renders no alerts message when alerts prop is undefined', () => {
    render(<AlertsList />);

    expect(screen.getByRole('heading', { name: /weather alerts/i })).toBeInTheDocument();
    expect(screen.getByText('No active weather alerts for this location')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'neutral');
  });

  it('renders a list of alerts when alerts are provided', () => {
    render(<AlertsList alerts={mockAlerts} />);

    expect(screen.getByRole('heading', { name: /weather alerts/i })).toBeInTheDocument();
    expect(screen.getByText('Severe Thunderstorm Warning')).toBeInTheDocument();
    expect(screen.getByText('Flood Warning')).toBeInTheDocument();
    expect(screen.getByText('Strong thunderstorms expected')).toBeInTheDocument();
    expect(screen.getByText('Potential flooding in low-lying areas')).toBeInTheDocument();
    expect(screen.getByText('Source: National Weather Service')).toBeInTheDocument();
    expect(screen.getByText('Source: Met Office')).toBeInTheDocument();

    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
    alerts.forEach(alert => {
      expect(alert).toHaveAttribute('data-status', 'warning');
    });
  });

  it('renders dates correctly for all alerts', () => {
    render(<AlertsList alerts={mockAlerts} />);

    mockAlerts.forEach(alert => {
      const startDate = new Date(alert.start * 1000).toLocaleString();
      const endDate = new Date(alert.end * 1000).toLocaleString();
      const validText = `Valid: ${startDate} - ${endDate}`;
      const dateElements = screen.getAllByText(validText);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });
});