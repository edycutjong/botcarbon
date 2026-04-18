'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { AttackEvent } from '@/lib/mock-data';
import { ATTACK_ORIGINS } from '@/lib/constants';
import { useMemo } from 'react';

interface AttackMapProps {
  events: AttackEvent[];
}

export function AttackMap({ events }: AttackMapProps) {
  // Aggregate attack counts by origin
  const originCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) {
      counts[event.originId] = (counts[event.originId] || 0) + 1;
    }
    return counts;
  }, [events]);

  return (
    <div className="glass-card gradient-border p-5 h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2
            className="text-sm font-bold tracking-wider text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ATTACK ORIGINS
          </h2>
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">
            Geographic threat intelligence
          </p>
        </div>
        <span className="text-xs font-mono text-[var(--color-text-muted)]">
          {Object.keys(originCounts).length} sources
        </span>
      </div>

      {/* Map area */}
      <div className="flex-1 relative bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] overflow-hidden">
        {/* Simple world map dots (SVG-free, pure CSS positioning) */}
        <div className="absolute inset-0">
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
              backgroundSize: '10% 10%',
            }}
          />

          {/* Equator line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-[var(--color-cyan)]/10" />
          {/* Prime meridian */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[var(--color-cyan)]/10" />

          {/* Attack origin dots */}
          <AnimatePresence>
            {ATTACK_ORIGINS.map((origin) => {
              const count = originCounts[origin.id] || 0;
              const intensity = Math.min(count / 10, 1);

              return (
                <motion.div
                  key={origin.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute group"
                  style={{
                    left: `${origin.x}%`,
                    top: `${origin.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Pulse ring */}
                  {count > 0 && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        width: `${16 + intensity * 24}px`,
                        height: `${16 + intensity * 24}px`,
                        marginLeft: `${-(8 + intensity * 12)}px`,
                        marginTop: `${-(8 + intensity * 12)}px`,
                        background: `rgba(239, 68, 68, ${0.1 + intensity * 0.2})`,
                      }}
                    />
                  )}

                  {/* Core dot */}
                  <div
                    className="rounded-full border-2 transition-all duration-300"
                    style={{
                      width: `${8 + intensity * 12}px`,
                      height: `${8 + intensity * 12}px`,
                      marginLeft: `${-(4 + intensity * 6)}px`,
                      marginTop: `${-(4 + intensity * 6)}px`,
                      background: count > 0
                        ? `rgba(239, 68, 68, ${0.4 + intensity * 0.6})`
                        : 'rgba(148, 163, 184, 0.3)',
                      borderColor: count > 0
                        ? `rgba(239, 68, 68, ${0.6 + intensity * 0.4})`
                        : 'rgba(148, 163, 184, 0.2)',
                      boxShadow: count > 0
                        ? `0 0 ${10 + intensity * 20}px rgba(239, 68, 68, ${0.2 + intensity * 0.3})`
                        : 'none',
                    }}
                  />

                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded px-2 py-1 text-[10px] font-mono whitespace-nowrap">
                      <span className="text-[var(--color-text-primary)]">{origin.label}</span>
                      <span className="text-[var(--color-red)] ml-1">{count} attacks</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Label bottom-right */}
        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[var(--color-text-muted)]/50">
          GLOBAL THREAT INTEL
        </div>
      </div>
    </div>
  );
}
