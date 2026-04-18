'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFormulaExplanation } from '@/lib/carbon';
import { KWH_PER_REQUEST, CO2_PER_KWH, CO2_PER_REQUEST } from '@/lib/constants';

export function FormulaTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        id="formula-tooltip-trigger"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-[10px] font-mono text-text-muted hover:border-cyan/30 hover:text-cyan transition-all"
      >
        <span>📐</span>
        <span>1 req = {(CO2_PER_REQUEST * 1000).toFixed(2)}g CO₂</span>
        <span className="text-text-muted">ⓘ</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-bg-secondary p-4 z-50 border border-cyan/20 shadow-2xl rounded-xl"
          >
            <h3 className="text-xs font-bold text-cyan mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              CARBON FORMULA
            </h3>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="flex justify-between px-2 py-1 rounded bg-bg-primary">
                <span className="text-text-secondary">Energy per request</span>
                <span className="text-cyan">{KWH_PER_REQUEST} kWh</span>
              </div>
              <div className="flex justify-between px-2 py-1 rounded bg-bg-primary">
                <span className="text-text-secondary">Grid emission factor</span>
                <span className="text-cyan">{CO2_PER_KWH} kg CO₂/kWh</span>
              </div>
              <div className="flex justify-between px-2 py-1 rounded bg-green-dim border border-green/20">
                <span className="text-green">CO₂ per blocked req</span>
                <span className="text-green font-bold">{(CO2_PER_REQUEST * 1000).toFixed(2)}g</span>
              </div>
            </div>

            <p className="text-[10px] text-text-muted mt-3 leading-relaxed">
              {getFormulaExplanation()}
            </p>

            <div className="mt-3 pt-2 border-t border-border text-[9px] text-text-muted">
              Source: Sustainable Web Design Model (SWD) • DIMPACT Project
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
