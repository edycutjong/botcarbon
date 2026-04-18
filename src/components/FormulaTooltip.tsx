'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFormulaExplanation } from '@/lib/carbon';
import { KWH_PER_REQUEST, CO2_PER_KWH, CO2_PER_REQUEST } from '@/lib/constants';

export function FormulaTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        id="formula-tooltip-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)] hover:border-[var(--color-cyan)]/30 hover:text-[var(--color-cyan)] transition-all"
      >
        <span>📐</span>
        <span>1 req = {(CO2_PER_REQUEST * 1000).toFixed(2)}g CO₂</span>
        <span className="text-[var(--color-text-muted)]">ⓘ</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 glass-card p-4 z-50 border border-[var(--color-cyan)]/20"
          >
            <h3 className="text-xs font-bold text-[var(--color-cyan)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              CARBON FORMULA
            </h3>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="flex justify-between px-2 py-1 rounded bg-[var(--color-bg-primary)]">
                <span className="text-[var(--color-text-secondary)]">Energy per request</span>
                <span className="text-[var(--color-cyan)]">{KWH_PER_REQUEST} kWh</span>
              </div>
              <div className="flex justify-between px-2 py-1 rounded bg-[var(--color-bg-primary)]">
                <span className="text-[var(--color-text-secondary)]">Grid emission factor</span>
                <span className="text-[var(--color-cyan)]">{CO2_PER_KWH} kg CO₂/kWh</span>
              </div>
              <div className="flex justify-between px-2 py-1 rounded bg-[var(--color-green-dim)] border border-[var(--color-green)]/20">
                <span className="text-[var(--color-green)]">CO₂ per blocked req</span>
                <span className="text-[var(--color-green)] font-bold">{(CO2_PER_REQUEST * 1000).toFixed(2)}g</span>
              </div>
            </div>

            <p className="text-[10px] text-[var(--color-text-muted)] mt-3 leading-relaxed">
              {getFormulaExplanation()}
            </p>

            <div className="mt-3 pt-2 border-t border-[var(--color-border)] text-[9px] text-[var(--color-text-muted)]">
              Source: Sustainable Web Design Model (SWD) • DIMPACT Project
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
