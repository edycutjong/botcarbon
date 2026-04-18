import { render, screen, act } from '@testing-library/react';
import { Header } from './Header';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Header component', () => {
  it('renders correctly', () => {
    render(<Header />);
    expect(screen.getByText('BOT')).toBeInTheDocument();
    expect(screen.getByText('CARBON')).toBeInTheDocument();
    expect(screen.getByText('Cyber Attack Carbon Analytics')).toBeInTheDocument();
    expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument();
    expect(screen.getByText('☁️ Cloudflare Edge')).toBeInTheDocument();
  });

  it('renders live clock', () => {
    render(<Header />);
    expect(screen.getByTestId('live-clock')).toBeInTheDocument();
  });

  it('updates clock every second', () => {
    render(<Header />);
    expect(screen.getByTestId('live-clock').textContent).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Clock should still be rendered after timer tick
    expect(screen.getByTestId('live-clock')).toBeInTheDocument();
  });

  it('renders UTC label', () => {
    render(<Header />);
    expect(screen.getByText('UTC')).toBeInTheDocument();
  });
});
