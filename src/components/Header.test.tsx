import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header component', () => {
  it('renders correctly', () => {
    render(<Header />);
    expect(screen.getByText('BOT')).toBeInTheDocument();
    expect(screen.getByText('CARBON')).toBeInTheDocument();
    expect(screen.getByText('Cyber Attack Carbon Analytics')).toBeInTheDocument();
    expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument();
    expect(screen.getByText('☁️ Cloudflare Edge')).toBeInTheDocument();
  });
});
