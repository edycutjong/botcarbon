'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { TrafficDataPoint } from '@/lib/mock-data';
import { COLORS } from '@/lib/constants';

interface TrafficChartProps {
  data: TrafficDataPoint[];
  shieldActive: boolean;
}

interface ChartTooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string;
}

/** Custom tooltip — declared outside render function per project pattern */
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-3 text-xs font-mono border border-border">
      <p className="text-text-secondary mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="text-text-primary font-semibold">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}



export function TrafficChart({ data, shieldActive }: TrafficChartProps) {
  return (
    <div className="glass-card gradient-border p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-sm font-bold tracking-wider text-text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            TRAFFIC MONITOR
          </h2>
          <p className="text-[10px] text-text-muted font-mono mt-0.5">
            Real-time request analysis • 2s intervals
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded bg-red" />
            <span className="text-text-muted">Blocked</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded bg-cyan" />
            <span className="text-text-muted">Passed</span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="gradBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.red} stopOpacity={0.4} />
                <stop offset="100%" stopColor={COLORS.red} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPassed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.3} />
                <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.1)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<ChartTooltip />} isAnimationActive={false} cursor={{ fill: 'transparent' }} />
            <Area
              type="monotone"
              dataKey="blocked"
              name="Blocked"
              stroke={COLORS.red}
              fill="url(#gradBlocked)"
              strokeWidth={2}
              animationDuration={500}
            />
            <Area
              type="monotone"
              dataKey="passed"
              name="Passed"
              stroke={COLORS.cyan}
              fill="url(#gradPassed)"
              strokeWidth={2}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Shield status bar */}
      <div
        className={`mt-3 px-3 py-2 rounded-lg text-[10px] font-mono flex items-center gap-2 transition-all duration-500 ${
          shieldActive
            ? 'bg-green-dim text-green border border-green/20'
            : 'bg-red-dim text-red border border-red/20'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${shieldActive ? 'bg-green' : 'bg-red blink'}`} />
        {shieldActive
          ? '✓ Cloudflare Edge Shield filtering 95% of malicious traffic'
          : '⚠ Unprotected — malicious requests consuming server resources'}
      </div>
    </div>
  );
}
