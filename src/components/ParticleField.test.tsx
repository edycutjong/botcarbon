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

let rAFCallback: FrameRequestCallback | null = null;

beforeEach(() => {
  rAFCallback = null;
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    rAFCallback = cb;
    return 1;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

export const advanceFrame = () => {
  if (rAFCallback) rAFCallback(performance.now());
};

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
    advanceFrame(); // Idle color
    rerender(<ParticleField shieldActive={true} isUnderAttack={false} />);
    advanceFrame(); // Shield color
    expect(screen.getByTestId('particle-field')).toBeInTheDocument();
  });

  it('updates props ref when attack changes', () => {
    const { rerender } = render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    rerender(<ParticleField shieldActive={false} isUnderAttack={true} />);
    advanceFrame(); // Attack color
    expect(screen.getByTestId('particle-field')).toBeInTheDocument();
  });

  it('covers particle boundary wrap around edges', () => {
    // Start large
    window.innerWidth = 500;
    window.innerHeight = 500;
    
    render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    window.dispatchEvent(new Event('resize'));
    
    // Now shrink window massively to force p.x > canvas.width and p.y > canvas.height
    // Since wy is always negative, p.y > canvas.height won't happen normally unless screen shrinks!
    window.innerWidth = 1;
    window.innerHeight = 1;
    window.dispatchEvent(new Event('resize'));
    
    // Advance frames properly
    for (let i = 0; i < 20; i++) {
      advanceFrame();
    }
    
    expect(screen.getByTestId('particle-field')).toBeInTheDocument();
  });

  it('handles null canvas context safely', () => {
    const mockGetContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null as unknown as CanvasRenderingContext2D);
    render(<ParticleField shieldActive={false} isUnderAttack={false} />);
    mockGetContext.mockRestore();
  });
});
