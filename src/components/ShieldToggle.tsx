'use client';

import { motion } from 'framer-motion';

interface ShieldToggleProps {
  active: boolean;
  onToggle: () => void;
}

export function ShieldToggle({ active, onToggle }: ShieldToggleProps) {
  return (
    <button
      id="shield-toggle"
      onClick={onToggle}
      className="flex items-center gap-3 group"
      aria-label={active ? 'Disable Cloudflare Edge Shield' : 'Enable Cloudflare Edge Shield'}
    >
      {/* Toggle track */}
      <div
        className={`relative w-16 h-8 rounded-full transition-all duration-500 ${
          active
            ? 'bg-gradient-to-r from-[var(--color-green)]/30 to-[var(--color-cyan)]/30 shadow-lg shadow-[var(--color-green)]/20'
            : 'bg-[var(--color-bg-card)] border border-[var(--color-border)]'
        }`}
      >
        {/* Toggle knob */}
        <motion.div
          animate={{ x: active ? 32 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
            active
              ? 'bg-[var(--color-green)] text-white shadow-lg shadow-[var(--color-green)]/30'
              : 'bg-[var(--color-text-muted)] text-[var(--color-bg-primary)]'
          }`}
        >
          {active ? '✓' : '×'}
        </motion.div>
      </div>

      {/* Label */}
      <div className="flex flex-col items-start">
        <span
          className={`text-sm font-bold tracking-wider transition-colors duration-300 ${
            active ? 'text-[var(--color-green)] glow-green' : 'text-[var(--color-text-secondary)]'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {active ? 'SHIELD ON' : 'SHIELD OFF'}
        </span>
        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
          {active ? 'Cloudflare Edge Protection Active' : 'Click to enable edge filtering'}
        </span>
      </div>

      {/* Pulse indicator when active */}
      {active && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative ml-1"
        >
          <div className="w-3 h-3 rounded-full bg-[var(--color-green)]">
            <div className="absolute inset-0 rounded-full bg-[var(--color-green)] animate-ping opacity-40" />
          </div>
        </motion.div>
      )}
    </button>
  );
}
