import { render, screen } from '@testing-library/react';
import React from 'react';
import { AttackMap } from './AttackMap';
import { AttackEvent } from '@/lib/mock-data';
import { ATTACK_ORIGINS } from '@/lib/constants';

jest.mock('react-simple-maps', () => {
  return {
    ComposableMap: ({ children }: { children: React.ReactNode }) => <svg data-testid="rs-map">{children}</svg>,
    Geographies: ({ children }: { children: (props: { geographies: Array<{ rsmKey: string, properties: Record<string, unknown> }> }) => React.ReactNode }) => {
      return children({ geographies: [{ rsmKey: 'dummy', properties: {} }] });
    },
    Geography: () => <g data-testid="geography" />,
    Marker: ({ children }: { children: React.ReactNode }) => <g data-testid="marker">{children}</g>,
  };
});

const mockEvents: AttackEvent[] = [
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `event-${i}`,
    timestamp: Date.now(),
    type: 'DDoS Flood' as const,
    ip: '192.168.1.1',
    origin: 'United States',
    originId: ATTACK_ORIGINS[0].id,
    statusCode: 403,
    path: '/',
    blocked: true,
    responseTimeMs: 5,
  })),
  {
    id: 'event-15',
    timestamp: Date.now(),
    type: 'SQL Injection',
    ip: '10.0.0.1',
    origin: 'China',
    originId: 'unknown',
    statusCode: 403,
    path: '/api',
    blocked: true,
    responseTimeMs: 15,
  }
];

describe('AttackMap component', () => {
  it('renders correctly and aggregates origins', () => {
    // originCounts should be ATTACK_ORIGINS[0] = 15, 'unknown' = 1
    // Total origins = 2.
    render(<AttackMap events={mockEvents} />);
    
    expect(screen.getByText('ATTACK ORIGINS')).toBeInTheDocument();
    expect(screen.getByText('GLOBAL THREAT INTEL')).toBeInTheDocument();
    
    // Check total sources count text "2 sources"
    expect(screen.getByText('2 sources')).toBeInTheDocument();

    // Check if the first origin label is rendered with "15 attacks"
    expect(screen.getByText(ATTACK_ORIGINS[0].label)).toBeInTheDocument();
    expect(screen.getByText('15 attacks')).toBeInTheDocument();
  });
  
  it('renders correctly with no events', () => {
    render(<AttackMap events={[]} />);
    expect(screen.getByText('0 sources')).toBeInTheDocument();
  })
});
