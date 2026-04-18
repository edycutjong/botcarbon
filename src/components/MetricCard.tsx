'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  icon: string;
  color: 'cyan' | 'green' | 'red' | 'amber';
  subtitle?: string;
  highlight?: boolean;
}

const colorMap = {
  cyan: {
    text: 'text-[var(--color-cyan)]',
    glow: 'glow-cyan',
    bg: 'bg-[var(--color-cyan-dim)]',
    border: 'border-[var(--color-cyan)]/20',
  },
  green: {
    text: 'text-[var(--color-green)]',
    glow: 'glow-green',
    bg: 'bg-[var(--color-green-dim)]',
    border: 'border-[var(--color-green)]/20',
  },
  red: {
    text: 'text-[var(--color-red)]',
    glow: 'glow-red',
    bg: 'bg-[var(--color-red-dim)]',
    border: 'border-[var(--color-red)]/20',
  },
  amber: {
    text: 'text-[var(--color-amber)]',
    glow: 'glow-amber',
    bg: 'bg-[var(--color-amber-dim)]',
    border: 'border-[var(--color-amber)]/20',
  },
};

export function MetricCard({ id, label, value, icon, color, subtitle, highlight }: MetricCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card gradient-border p-5 relative overflow-hidden ${
        highlight ? 'ring-1 ring-[var(--color-green)]/30' : ''
      }`}
    >
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colors.bg} ${colors.border} border mb-3 text-lg`}>
        {icon}
      </div>

      {/* Label */}
      <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
        {label}
      </p>

      {/* Value */}
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`text-2xl md:text-3xl font-bold font-mono ${colors.text} ${colors.glow}`}
      >
        {value}
      </motion.p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-[var(--color-text-muted)] font-mono mt-1">
          {subtitle}
        </p>
      )}

      {/* Ambient glow on highlight */}
      {highlight && (
        <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-[var(--color-green)]/10 blur-2xl" />
      )}
    </motion.div>
  );
}
