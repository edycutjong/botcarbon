'use client';

import { motion } from 'framer-motion';
import type { CarbonMetrics } from '@/lib/carbon';
import { formatCo2, formatKwh } from '@/lib/carbon';

interface CarbonGaugeProps {
  carbon: CarbonMetrics;
  shieldActive: boolean;
}

export function CarbonGauge({ carbon, shieldActive }: CarbonGaugeProps) {
  const { savedCo2Kg, savedKwh, equivalencies } = carbon;

  return (
    <div className="glass-card gradient-border p-5 h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2
          className="text-sm font-bold tracking-wider text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          CARBON SAVINGS
        </h2>
        <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">
          Environmental impact of edge protection
        </p>
      </div>

      {/* Big CO2 number */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <motion.div
          key={formatCo2(savedCo2Kg)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-center"
        >
          <p
            className={`text-4xl md:text-5xl font-black font-mono ${
              shieldActive ? 'text-[var(--color-green)] glow-green' : 'text-[var(--color-text-muted)]'
            }`}
          >
            {formatCo2(savedCo2Kg)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] font-mono mt-1">
            CO₂ PREVENTED
          </p>
        </motion.div>

        {/* Energy saved */}
        <div className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-center">
          <p className="text-lg font-bold font-mono text-[var(--color-cyan)]">
            {formatKwh(savedKwh)}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
            ENERGY SAVED
          </p>
        </div>
      </div>

      {/* Equivalencies */}
      <div className="space-y-2 mt-auto">
        <p className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase tracking-wider mb-2">
          Equivalent to:
        </p>

        <EquivalencyRow
          icon="🚗"
          label="Miles not driven"
          value={equivalencies.carMiles.toFixed(1)}
          active={shieldActive}
        />
        <EquivalencyRow
          icon="🔋"
          label="Phone charges saved"
          value={Math.floor(equivalencies.phoneCharges).toLocaleString()}
          active={shieldActive}
        />
        <EquivalencyRow
          icon="🌳"
          label="Trees (1 year equiv.)"
          value={equivalencies.treesYear.toFixed(3)}
          active={shieldActive}
        />
        <EquivalencyRow
          icon="🏠"
          label="Home-days of power"
          value={equivalencies.homeDays.toFixed(3)}
          active={shieldActive}
        />
      </div>
    </div>
  );
}

function EquivalencyRow({
  icon,
  label,
  value,
  active,
}: {
  icon: string;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)]">
      <span className="flex items-center gap-2 text-xs">
        <span>{icon}</span>
        <span className="text-[var(--color-text-secondary)] font-mono">{label}</span>
      </span>
      <motion.span
        key={value}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`text-xs font-bold font-mono ${
          active ? 'text-[var(--color-green)]' : 'text-[var(--color-text-muted)]'
        }`}
      >
        {value}
      </motion.span>
    </div>
  );
}
