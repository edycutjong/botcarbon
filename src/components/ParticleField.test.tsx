import { render, screen } from '@testing-library/react';
import { ParticleField } from './ParticleField';

// Mock canvas 2d context
const mockCtx = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
};

beforeEach(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ParticleField', () => {
  it('renders canvas element', () => {
    render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    expect(screen.getByTestId('particle-field')).toBeInTheDocument();
  });

  it('is aria-hidden for accessibility', () => {
    render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    expect(screen.getByTestId('particle-field')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has pointer-events-none class', () => {
    render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    expect(screen.getByTestId('particle-field')).toHaveClass('pointer-events-none');
  });

  it('initializes canvas context', () => {
    render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
  });

  it('starts animation loop', () => {
    render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('updates props ref when shield changes', () => {
    const { rerender } = render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    rerender(<ParticleField shieldActive={true} isUnderAttack={false} />);
    // Should not crash — props ref updated internally
    expect(screen.getByTestId('particle-field')).toBeInTheDocument();
  });

  it('updates props ref when attack changes', () => {
    const { rerender } = render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    rerender(<ParticleField shieldActive={false} isUnderAttack={true} />);
    expect(screen.getByTestId('particle-field')).toBeInTheDocument();
  });
});
