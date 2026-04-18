import { render, screen, fireEvent } from '@testing-library/react';
import { ShieldToggle } from './ShieldToggle';

describe('ShieldToggle component', () => {
  it('renders in active state', () => {
    const onToggle = jest.fn();
    render(<ShieldToggle active={true} onToggle={onToggle} />);
    
    expect(screen.getByText('SHIELD ON')).toBeInTheDocument();
    expect(screen.getByText('Cloudflare Edge Protection Active')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: 'Disable Cloudflare Edge Shield' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders in inactive state', () => {
    const onToggle = jest.fn();
    render(<ShieldToggle active={false} onToggle={onToggle} />);
    
    expect(screen.getByText('SHIELD OFF')).toBeInTheDocument();
    expect(screen.getByText('Click to enable edge filtering')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: 'Enable Cloudflare Edge Shield' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
