'use client';

import { MetricCard } from '@/components/MetricCard';
import { TrafficChart } from '@/components/TrafficChart';
import { ShieldToggle } from '@/components/ShieldToggle';
import { CarbonGauge } from '@/components/CarbonGauge';
import { AttackLog } from '@/components/AttackLog';
import { AttackMap } from '@/components/AttackMap';
import { FormulaTooltip } from '@/components/FormulaTooltip';
import { Header } from '@/components/Header';
import { calculateCarbon, formatNumber, formatKwh, formatCo2 } from '@/lib/carbon';
import {
  generateInitialTraffic,
  generateTrafficPoint,
  generateAttackBatch,
  type AttackEvent,
  type TrafficDataPoint,
} from '@/lib/mock-data';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export default function DashboardPage() {
  // ---- State (lazy initializers) ----
  const [shieldActive, setShieldActive] = useState(false);
  const [isUnderAttack, setIsUnderAttack] = useState(true);
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>(() =>
    generateInitialTraffic(false)
  );
  const [attackLog, setAttackLog] = useState<AttackEvent[]>(() =>
    generateAttackBatch(15, false)
  );

  // Ref to track shield state in intervals
  const shieldRef = useRef(shieldActive);
  const attackRef = useRef(isUnderAttack);

  useEffect(() => {
    shieldRef.current = shieldActive;
  }, [shieldActive]);

  useEffect(() => {
    attackRef.current = isUnderAttack;
  }, [isUnderAttack]);

  // ---- Cumulative totals from traffic data ----
  const totals = useMemo(() => {
    return trafficData.reduce(
      (acc, point) => ({
        blocked: acc.blocked + point.blocked,
        total: acc.total + point.total,
      }),
      { blocked: 0, total: 0 }
    );
  }, [trafficData]);
  
  const totalBlocked = totals.blocked;
  const totalRequests = totals.total;

  // ---- Real-time traffic simulation ----
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint = generateTrafficPoint(shieldRef.current, attackRef.current);
      setTrafficData((prev) => [...prev.slice(-29), newPoint]);

      // Generate attack log entries
      const newEvents = generateAttackBatch(
        attackRef.current ? Math.floor(Math.random() * 5) + 2 : 1,
        shieldRef.current
      );
      setAttackLog((prev) => [...newEvents, ...prev].slice(0, 50));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ---- Toggle handler ----
  const handleShieldToggle = useCallback(() => {
    setShieldActive((prev) => !prev);
  }, []);

  // ---- Attack simulation toggle ----
  const handleAttackToggle = useCallback(() => {
    setIsUnderAttack((prev) => !prev);
  }, []);

  // ---- Carbon calculations ----
  const carbon = calculateCarbon(totalRequests, totalBlocked);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full">
        {/* Top controls bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <ShieldToggle active={shieldActive} onToggle={handleShieldToggle} />
            <button
              id="attack-toggle"
              onClick={handleAttackToggle}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-300 ${
                isUnderAttack
                  ? 'bg-[var(--color-red-dim)] text-[var(--color-red)] border border-[var(--color-red)]/30'
                  : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
              }`}
            >
              {isUnderAttack ? '🔴 ATTACK ACTIVE' : '⚪ Idle'}
            </button>
          </div>
          <FormulaTooltip />
        </div>

        {/* Metric cards row */}
        <div className="dashboard-grid mb-6">
          <MetricCard
            id="metric-blocked"
            label="Requests Blocked"
            value={formatNumber(carbon.blockedRequests)}
            icon="🛡️"
            color="cyan"
            subtitle={`of ${formatNumber(carbon.totalRequests)} total`}
          />
          <MetricCard
            id="metric-kwh"
            label="Energy Saved"
            value={formatKwh(carbon.savedKwh)}
            icon="⚡"
            color="green"
            subtitle={`${formatKwh(carbon.wastedKwh)} wasted`}
          />
          <MetricCard
            id="metric-co2"
            label="CO₂ Prevented"
            value={formatCo2(carbon.savedCo2Kg)}
            icon="🌍"
            color="green"
            subtitle={shieldActive ? 'Shield active' : 'Shield off'}
            highlight={shieldActive}
          />
          <MetricCard
            id="metric-response"
            label="Avg Block Time"
            value="<5ms"
            icon="⏱️"
            color="cyan"
            subtitle="Edge-computed"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Traffic chart (2/3 width) */}
          <div className="xl:col-span-2">
            <TrafficChart data={trafficData} shieldActive={shieldActive} />
          </div>

          {/* Carbon gauge (1/3 width) */}
          <div>
            <CarbonGauge carbon={carbon} shieldActive={shieldActive} />
          </div>
        </div>

        {/* Bottom row: Attack map + Attack log */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AttackMap events={attackLog} />
          <AttackLog events={attackLog} shieldActive={shieldActive} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-4 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[var(--color-text-muted)] font-mono">
          <span>BotCarbon — HackOWASP 8.0 | SDG 13 × Cybersecurity</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-cyan)] blink" />
            Powered by Cloudflare Edge Network
          </span>
        </div>
      </footer>
    </div>
  );
}
