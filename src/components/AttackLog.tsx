'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { AttackEvent } from '@/lib/mock-data';

interface AttackLogProps {
  events: AttackEvent[];
  shieldActive: boolean;
}

export function AttackLog({ events, shieldActive }: AttackLogProps) {
  return (
    <div className="glass-card gradient-border p-5 h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2
            className="text-sm font-bold tracking-wider text-text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            THREAT LOG
          </h2>
          <p className="text-[10px] text-text-muted font-mono mt-0.5">
            Live attack event stream
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${shieldActive ? 'bg-green' : 'bg-red blink'}`} />
          <span className="text-[10px] font-mono text-text-muted">
            {events.filter((e) => e.blocked).length} blocked
          </span>
        </div>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto terminal-scroll space-y-1">
        <AnimatePresence initial={false}>
          {events.slice(0, 30).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-mono ${
                event.blocked
                  ? 'bg-green-dim/50 border-l-2 border-green'
                  : 'bg-red-dim/50 border-l-2 border-red'
              }`}
            >
              {/* Status icon */}
              <span className={event.blocked ? 'text-green' : 'text-red'}>
                {event.blocked ? '✗' : '⚠'}
              </span>

              {/* Timestamp */}
              <span className="text-text-muted w-[60px] shrink-0">
                {new Date(event.timestamp).toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>

              {/* Type */}
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0 ${
                  event.blocked
                    ? 'bg-green/20 text-green'
                    : 'bg-red/20 text-red'
                }`}
              >
                {event.blocked ? 'BLOCKED' : 'PASSED'}
              </span>

              {/* Attack type */}
              <span className="text-amber shrink-0">{event.type}</span>

              {/* Path */}
              <span className="text-text-muted truncate">{event.path}</span>

              {/* IP */}
              <span className="text-text-muted ml-auto shrink-0 hidden lg:block">
                {event.ip}
              </span>

              {/* Response time */}
              <span
                className={`shrink-0 ${
                  event.responseTimeMs < 10
                    ? 'text-green'
                    : 'text-red'
                }`}
              >
                {event.responseTimeMs}ms
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
