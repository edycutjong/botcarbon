import { render, screen } from '@testing-library/react';
import { TrafficChart, ChartTooltip } from './TrafficChart';
import { TrafficDataPoint } from '@/lib/mock-data';

// We also need to test ChartTooltip directly or rely on Recharts mock not supporting it.
// The Recharts mock in jest.setup.ts:
// mock: (props: any) => React.createElement('div', { 'data-testid': 'mock-AreaChart' }, props.children)
// It probably doesn't trigger the Tooltip render. 
// We can manually export and test ChartTooltip or mock it.
// Wait, the `ChartTooltip` is not exported. But I can trick it by finding the Tooltip mock, or I can just test the TrafficChart component. It's functional coverage.

const mockData: TrafficDataPoint[] = [
  { time: '10:00:00', timestamp: 1672531200000, passed: 100, blocked: 50, total: 150, kwhWasted: 0.05 },
  { time: '10:00:02', timestamp: 1672531202000, passed: 110, blocked: 60, total: 170, kwhWasted: 0.06 },
];

describe('TrafficChart component', () => {
  it('renders correctly with shield active', () => {
    render(<TrafficChart data={mockData} shieldActive={true} />);
    expect(screen.getByText('TRAFFIC MONITOR')).toBeInTheDocument();
    expect(screen.getByText('✓ Cloudflare Edge Shield filtering 95% of malicious traffic')).toBeInTheDocument();
  });

  it('renders correctly with shield inactive', () => {
    render(<TrafficChart data={mockData} shieldActive={false} />);
    expect(screen.getByText('⚠ Unprotected — malicious requests consuming server resources')).toBeInTheDocument();
  });

  describe('ChartTooltip', () => {
    it('returns null if not active', () => {
      const { container } = render(<ChartTooltip active={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null if no payload', () => {
      const { container } = render(<ChartTooltip active={true} payload={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders correctly with payload', () => {
      const payload = [
        { name: 'Blocked', value: 50, color: 'red' },
        { name: 'Passed', value: 100, color: 'cyan' },
      ];
      render(<ChartTooltip active={true} payload={payload} label="10:00:00" />);
      
      expect(screen.getByText('10:00:00')).toBeInTheDocument();
      expect(screen.getByText('Blocked:')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Passed:')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });
});
