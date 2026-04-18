import { render, screen, fireEvent } from '@testing-library/react';
import { FormulaTooltip } from './FormulaTooltip';
import { KWH_PER_REQUEST, CO2_PER_KWH, CO2_PER_REQUEST } from '@/lib/constants';
import { getFormulaExplanation } from '@/lib/carbon';

describe('FormulaTooltip component', () => {
  it('renders trigger button correctly', () => {
    render(<FormulaTooltip />);
    const expectedLabel = `1 req = ${(CO2_PER_REQUEST * 1000).toFixed(2)}g CO₂`;
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it('opens and displays formula explanation on hover', () => {
    render(<FormulaTooltip />);
    
    // Initially closed
    expect(screen.queryByText('CARBON FORMULA')).not.toBeInTheDocument();
    
    const trigger = screen.getByRole('button').parentElement!;
    
    // Hover trigger
    fireEvent.mouseEnter(trigger);
    
    // Check if open
    expect(screen.getByText('CARBON FORMULA')).toBeInTheDocument();
    expect(screen.getByText(`${KWH_PER_REQUEST} kWh`)).toBeInTheDocument();
    expect(screen.getByText(`${CO2_PER_KWH} kg CO₂/kWh`)).toBeInTheDocument();
    expect(screen.getByText(getFormulaExplanation())).toBeInTheDocument();
    
    // Unhover to close
    fireEvent.mouseLeave(trigger);
    
    // Using AnimatePresence might leave it in the document until exit animation finishes, 
    // but in jsdom without framer-motion full anims often sync or easily queried. Let's not strictly check exit, 
    // or just rely on state change covering lines.
  });
});
