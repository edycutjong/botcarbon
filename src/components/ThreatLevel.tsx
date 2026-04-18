'use client';

import { motion } from 'framer-motion';

interface ThreatLevelProps {
  isUnderAttack: boolean;
  shieldActive: boolean;
  blockedPercentage: number;
}

type ThreatStatus = 'NOMINAL' | 'MITIGATED' | 'CRITICAL';

const STATUS_CONFIG: Record<ThreatStatus, {
  colorClass: string;
  textColor: string;
  glowClass: string;
  dotColor: string;
  dotBlink: boolean;
  barWidth: (pct: number) => string;
}> = {
  NOMINAL: {
    colorClass: 'from-cyan/20 via-cyan/40 to-cyan/20',
    textColor: 'text-cyan',
    glowClass: 'glow-cyan',
    dotColor: 'bg-cyan',
    dotBlink: false,
    barWidth: () => '20%',
  },
  MITIGATED: {
    colorClass: 'from-green/20 via-green/40 to-green/20',
    textColor: 'text-green',
    glowClass: 'glow-green',
    dotColor: 'bg-green',
    dotBlink: false,
    barWidth: (pct: number) => `${pct}%`,
  },
  CRITICAL: {
    colorClass: 'from-red/30 via-red/60 to-amber/30',
    textColor: 'text-red',
    glowClass: 'glow-red',
    dotColor: 'bg-red',
    dotBlink: true,
    barWidth: () => '100%',
  },
};

function getStatus(isUnderAttack: boolean, shieldActive: boolean): ThreatStatus {
  if (!isUnderAttack) return 'NOMINAL';
  return shieldActive ? 'MITIGATED' : 'CRITICAL';
}

export function ThreatLevel({ isUnderAttack, shieldActive, blockedPercentage }: ThreatLevelProps) {
  const level = getStatus(isUnderAttack, shieldActive);
  const config = STATUS_CONFIG[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card gradient-border px-4 py-3 mb-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${config.dotColor} ${
              config.dotBlink ? 'blink' : ''
            }`}
          />
          <span
            className={`text-xs font-bold tracking-widest ${config.textColor} ${config.glowClass}`}
            style={{ fontFamily: 'var(--font-display)' }}
            data-testid="threat-status"
          >
            THREAT: {level}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
          <span>
            Block rate:{' '}
            <span className={config.textColor} data-testid="block-rate">
              {blockedPercentage.toFixed(1)}%
            </span>
          </span>
        </div>
      </div>

      {/* Animated threat bar */}
      <div className="mt-2 h-1 rounded-full bg-bg-primary overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${config.colorClass}`}
          initial={{ width: '0%' }}
          animate={{ width: config.barWidth(blockedPercentage) }}
          transition={{ duration: 1, ease: 'easeOut' }}
          data-testid="threat-bar"
        />
      </div>

      {/* Critical pulsing border overlay */}
      {level === 'CRITICAL' && (
        <motion.div
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl border border-red/40 pointer-events-none"
        />
      )}
    </motion.div>
  );
}
