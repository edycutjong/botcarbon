import { render, screen } from '@testing-library/react';
import { ThreatLevel } from './ThreatLevel';

describe('ThreatLevel', () => {
  it('shows NOMINAL when no attack', () => {
    render(<ThreatLevel isUnderAttack={false} shieldActive={false} blockedPercentage={10} />);
    expect(screen.getByTestId('threat-status')).toHaveTextContent('THREAT: NOMINAL');
  });

  it('shows CRITICAL when under attack with shield off', () => {
    render(<ThreatLevel isUnderAttack={true} shieldActive={false} blockedPercentage={8} />);
    expect(screen.getByTestId('threat-status')).toHaveTextContent('THREAT: CRITICAL');
  });

  it('shows MITIGATED when under attack with shield on', () => {
    render(<ThreatLevel isUnderAttack={true} shieldActive={true} blockedPercentage={95} />);
    expect(screen.getByTestId('threat-status')).toHaveTextContent('THREAT: MITIGATED');
  });

  it('displays block rate percentage', () => {
    render(<ThreatLevel isUnderAttack={false} shieldActive={false} blockedPercentage={42.5} />);
    expect(screen.getByTestId('block-rate')).toHaveTextContent('42.5%');
  });

  it('renders threat bar', () => {
    render(<ThreatLevel isUnderAttack={true} shieldActive={true} blockedPercentage={95} />);
    expect(screen.getByTestId('threat-bar')).toBeInTheDocument();
  });

  it('applies green text for MITIGATED state', () => {
    render(<ThreatLevel isUnderAttack={true} shieldActive={true} blockedPercentage={90} />);
    const status = screen.getByTestId('threat-status');
    expect(status).toHaveClass('text-green');
  });

  it('applies red text for CRITICAL state', () => {
    render(<ThreatLevel isUnderAttack={true} shieldActive={false} blockedPercentage={5} />);
    const status = screen.getByTestId('threat-status');
    expect(status).toHaveClass('text-red');
  });

  it('applies cyan text for NOMINAL state', () => {
    render(<ThreatLevel isUnderAttack={false} shieldActive={false} blockedPercentage={0} />);
    const status = screen.getByTestId('threat-status');
    expect(status).toHaveClass('text-cyan');
  });
});
