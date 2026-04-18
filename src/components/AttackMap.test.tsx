import { render, screen } from '@testing-library/react';
import { AttackMap } from './AttackMap';
import { AttackEvent } from '@/lib/mock-data';
import { ATTACK_ORIGINS } from '@/lib/constants';

const mockEvents: AttackEvent[] = [
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `event-${i}`,
    timestamp: Date.now(),
    type: 'DDoS',
    ip: '192.168.1.1',
    country: 'US',
    path: '/',
    blocked: true,
    co2SavedKg: 0.001,
    responseTimeMs: 5,
    originId: ATTACK_ORIGINS[0].id, // First known origin
  })),
  {
    id: 'event-15',
    timestamp: Date.now(),
    type: 'SQLi',
    ip: '10.0.0.1',
    country: 'CN',
    path: '/api',
    blocked: true,
    co2SavedKg: 0.001,
    responseTimeMs: 15,
    originId: 'unknown', // Unknown origin should be basically ignored for map, but counted or not matching any ATTACK_ORIGINS dot
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
