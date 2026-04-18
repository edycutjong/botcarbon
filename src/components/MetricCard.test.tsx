import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard component', () => {
  it('renders basic props correctly', () => {
    render(
      <MetricCard
        id="test-card"
        label="Test Label"
        value="100"
        icon="🚀"
        color="cyan"
      />
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <MetricCard
        id="test-card"
        label="Test Label"
        value="100"
        icon="🚀"
        color="green"
        subtitle="Test Subtitle"
      />
    );
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('applies highlight classes when highlight is true', () => {
    const { container } = render(
      <MetricCard
        id="test-card"
        label="Test Label"
        value="100"
        icon="🚀"
        color="amber"
        highlight={true}
      />
    );
    // highlight uses 'ring-1' on the container
    expect(container.firstChild).toHaveClass('ring-1');
  });
  
  it('renders correctly for red color', () => {
    render(
      <MetricCard
        id="test-card"
        label="Test Label"
        value="100"
        icon="🚀"
        color="red"
      />
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
});
